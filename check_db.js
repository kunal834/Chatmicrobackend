import mongoose from "mongoose";
import dotenv from "dotenv";

// 1. Load your .env file so we can access the MONGODB_URI
dotenv.config();

// 2. Define a minimal Schema that matches your REAL users collection
// You don't need the full schema, just the fields you want to check.
const UserSchema = new mongoose.Schema({ 
    name: String, 
    email: String,
   
});

// IMPORTANT: Mongoose automatically looks for the plural, lowercase version.
// So model "User" will look for the collection "users" in your DB.
const User = mongoose.model("User", UserSchema);

const checkConnection = async () => {
  try {
    // 3. Connect to the Database
    console.log("⏳ Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ Connected to host: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`); // THIS MUST SAY "test"

    // 4. Try to find ONE real user
    console.log("🔍 Searching for a user in the 'users' collection...");
    const user = await User.find({});

    if (user) {
      console.log("\n🎉 SUCCESS! Found a real Daplink user:");
      console.log("------------------------------------------------");
      console.log(`ID:    ${user}`);
      // console.log(`Email: ${user}`);
      // console.log(`Handle/Name: ${user.name}`);
      console.log("------------------------------------------------");
      console.log("✅ Your backend is correctly linked to your Daplink data.");
    } else {
      console.log("\n⚠️ Connected to DB, but found NO users.");
      console.log("Possible reasons:");
      console.log("1. The collection name is not 'users' (Check Atlas).");
      console.log("2. The database name in .env is not '/test'.");
    }

    // 5. Close connection
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("\n❌ ERROR: Could not connect or find data.");
    console.error(error);
    process.exit(1);
  }
};

checkConnection();