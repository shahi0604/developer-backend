require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 10000; // Using 10000 as Render assigned this port previously

// 1. Define Schema and Model FIRST
const DeveloperSchema = new mongoose.Schema({
    name: String,
    role: String,
    techStack: String,
    experience: Number
});

const Developer = mongoose.model("Developer", DeveloperSchema);

// 2. Define Routes
app.post("/developers", async (req, res) => {
    try {
        // Ensure connection is established before interacting with the Model
        if (mongoose.connection.readyState !== 1) {
             return res.status(503).json({ error: "Service Unavailable: Database not connected" });
        }
        const dev = new Developer(req.body);
        await dev.save();
        res.json({ message: "Developer saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/developers", async (req, res) => {
    try {
        // Ensure connection is established before interacting with the Model
        if (mongoose.connection.readyState !== 1) {
             return res.status(503).json({ error: "Service Unavailable: Database not connected" });
        }
        const developers = await Developer.find();
        res.json(developers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Connect to Database and START Server ONLY on success
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected");
    // CRITICAL: Start the server ONLY when the DB connection is ready
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
    console.error("MongoDB connection error:", err.message);
    // Exit the process if the database connection fails
    process.exit(1); 
});