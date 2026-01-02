import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    SenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ReceiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    MessageText: { type: String, required: true },
    Timestamp: { type: Date, default: Date.now }
});

const Messages = mongoose.model("Message", MessageSchema);

export default Messages;