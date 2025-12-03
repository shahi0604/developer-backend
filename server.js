require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
