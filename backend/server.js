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
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  parent: { type: String, default: null }, // Add parent field
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
});

const edgeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  target: { type: String, required: true },
});

const Node = mongoose.model("Node", nodeSchema);
const Edge = mongoose.model("Edge", edgeSchema);

// API Endpoints

// Get graph data
app.get("/graph", async (req, res) => {
  try {
    const nodes = await Node.find();
    const edges = await Edge.find();

    // Ensure parent relationships are included
    const graphData = nodes.map((node) => ({
      id: node.id,
      label: node.label,
      parent: node.parent || null, // Include parent info
      position: node.position,
    }));

    res.json({ nodes: graphData, edges });
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

// Add a new node with parent support
app.post("/add-node", async (req, res) => {
  const { id, label, position, parent } = req.body;

  if (!id || !label || !position) {
    return res
      .status(400)
      .json({ error: "Missing required fields: id, label, position" });
  }

  try {
    const newNode = new Node({
      id,
      label,
      position,
      parent: parent || null, // Set parent if provided
    });
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

// Update node position
app.post("/update-node-position", async (req, res) => {
  const { id, position } = req.body;

  if (!id || !position) {
    return res
      .status(400)
      .json({ error: "Missing required fields: id, position" });
  }

  try {
    const updatedNode = await Node.findOneAndUpdate(
      { id },
      { position },
      { new: true } // Return the updated document
    );

    if (!updatedNode) {
      return res.status(404).json({ error: "Node not found" });
    }

    res.json({ message: "Node position updated successfully!", updatedNode });
  } catch (error) {
    console.error("Error updating node position:", error);
    res.status(500).json({ error: "Failed to update node position" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
