import Express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import connectDB from "./lib/db.js";
import Message from "./models/Message.js"; // Use your Model directly here

const app = Express();
const PORT = 5000;

// 1. Database Connection
connectDB();

const server = http.createServer(app);

// 2. Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] }));

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

// 3. User Map (Keep it simple)
const onlineUsers = {}; // Renamed for clarity

io.on("connection", (socket) => {
    // Get User ID from frontend handshake
    const userId = socket.handshake.query.userID;
    
    if (userId) {
        onlineUsers[userId] = socket.id;
        console.log(`✅ User ${userId} connected on socket ${socket.id}`);
    }

    // --- EVENT: SEND MESSAGE ---
    // (This replaces your SendMessages controller completely)
    socket.on("send_message", async (data) => {
        try {
            const { receiverId, text } = data; // Data from Frontend
            const senderId = userId; // We already know who they are!

            // A. Save to Database
            const newMessage = await Message.create({
                SenderId: senderId,
                ReceiverId: receiverId,
                MessageText: text
            });

            // B. Find Receiver's Socket
            const receiverSocketId = onlineUsers[receiverId];

            // C. Send Instantly
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", newMessage);
            }
            
            // D. Send back to Sender (so their UI updates too)
            socket.emit("message_sent", newMessage);

        } catch (err) {
            console.log("Error sending message:", err);
        }
    });

    // --- EVENT: DISCONNECT ---
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        // Correct way to remove user
        if (userId && onlineUsers[userId] === socket.id) {
            delete onlineUsers[userId];
        }
    });
});

if(process.env.NODE_ENV != "production") {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}