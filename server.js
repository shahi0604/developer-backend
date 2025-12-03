const cors = require("cors");
app.use(cors());git init
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Replace YOUR_PASSWORD with your actual password
const MONGO_URI = "mongodb+srv://shahina0604_db_user:shahina_2006@cluster0.1mnjg5j.mongodb.net/dev-directory";

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

// Developer Schema
const DeveloperSchema = new mongoose.Schema({
    name: String,
    role: String,
    techStack: String,
    experience: Number
});

const Developer = mongoose.model("Developer", DeveloperSchema);

// Routes
app.post("/developers", async (req, res) => {
    try {
        const dev = new Developer(req.body);
        await dev.save();
        res.json({ message: "Developer saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/developers", async (req, res) => {
    const developers = await Developer.find();
    res.json(developers);
});

app.listen(5000, () => console.log("Server running on port 5000"));
