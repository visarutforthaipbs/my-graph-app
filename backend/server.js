const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5001;

// In-memory graph data
let graphData = {
  nodes: [
    {
      id: "root",
      label: "พลังความม่วนจากภาคอีสาน",
      position: { x: 300, y: 300 },
    },
  ],
  edges: [],
};

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Get graph data
app.get("/graph", (req, res) => {
  res.json(graphData);
});

// Updated save graph endpoint to include positions
app.post("/graph", (req, res) => {
  const { nodes, edges } = req.body;
  graphData = {
    nodes: nodes.map((node) => ({
      ...node,
      position: node.position || {
        x: Math.random() * 500,
        y: Math.random() * 500,
      }, // Default random position
    })),
    edges,
  };
  console.log("Graph data updated:", graphData);
  res.json({ message: "Graph saved successfully!" });
});

// Add a new node
app.post("/add-node", (req, res) => {
  const { id, label, position } = req.body;

  if (!id || !label || !position) {
    return res
      .status(400)
      .json({ error: "Missing required fields: id, label, position" });
  }

  const newNode = { id, label, position };
  graphData.nodes.push(newNode);

  res.json({ message: "Node added successfully!", newNode });
});

// Add a new edge
app.post("/add-edge", (req, res) => {
  const { source, target } = req.body;

  if (!source || !target) {
    return res
      .status(400)
      .json({ error: "Missing required fields: source, target" });
  }

  const newEdge = { source, target };
  graphData.edges.push(newEdge);

  res.json({ message: "Edge added successfully!", newEdge });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
