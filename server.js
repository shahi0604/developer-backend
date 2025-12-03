require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Add this route here
app.get("/", (req, res) => {
    res.send("Backend running successfully!");
});

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 10000;

const DeveloperSchema = new mongoose.Schema({
    name: String,
    role: String,
    techStack: String,
    experience: Number
});

const Developer = mongoose.model("Developer", DeveloperSchema);

app.post("/developers", async (req, res) => {
    try {
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
        if (mongoose.connection.readyState !== 1) {
             return res.status(503).json({ error: "Service Unavailable: Database not connected" });
        }
        const developers = await Developer.find();
        res.json(developers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
});
