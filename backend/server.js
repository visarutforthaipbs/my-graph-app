const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mongodb+srv://visarut298:yuog4Ybz5kn3KYjZ@cluster0.itwbx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Mongoose schemas and models
const nodeSchema = new mongoose.Schema({
  id: String,
  label: String,
  position: {
    x: Number,
    y: Number,
  },
});

const edgeSchema = new mongoose.Schema({
  source: String,
  target: String,
});

const Node = mongoose.model("Node", nodeSchema);
const Edge = mongoose.model("Edge", edgeSchema);

// API Endpoints

// Get graph data
app.get("/graph", async (req, res) => {
  try {
    const nodes = await Node.find();
    const edges = await Edge.find();
    res.json({ nodes, edges });
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ error: "Failed to fetch graph data" });
  }
});

// Save graph data
app.post("/graph", async (req, res) => {
  const { nodes, edges } = req.body;

  try {
    await Node.deleteMany();
    await Edge.deleteMany();

    await Node.insertMany(nodes);
    await Edge.insertMany(edges);

    res.json({ message: "Graph saved successfully!" });
  } catch (error) {
    console.error("Error saving graph data:", error);
    res.status(500).json({ error: "Failed to save graph data" });
  }
});

// Add a new node
app.post("/add-node", async (req, res) => {
  const { id, label, position } = req.body;

  if (!id || !label || !position) {
    return res
      .status(400)
      .json({ error: "Missing required fields: id, label, position" });
  }

  try {
    const newNode = new Node({ id, label, position });
    await newNode.save();

    res.json({ message: "Node added successfully!", newNode });
  } catch (error) {
    console.error("Error adding node:", error);
    res.status(500).json({ error: "Failed to add node" });
  }
});

// Add a new edge
app.post("/add-edge", async (req, res) => {
  const { source, target } = req.body;

  if (!source || !target) {
    return res
      .status(400)
      .json({ error: "Missing required fields: source, target" });
  }

  try {
    const newEdge = new Edge({ source, target });
    await newEdge.save();

    res.json({ message: "Edge added successfully!", newEdge });
  } catch (error) {
    console.error("Error adding edge:", error);
    res.status(500).json({ error: "Failed to add edge" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
