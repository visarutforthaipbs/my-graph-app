import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import fcose from "cytoscape-fcose"; // Ensure this library is installed
import "./GraphContainer.css";

// Initialize fcose layout
Cytoscape.use(fcose);

const GraphContainer = ({ elements, handleNodeClick }) => {
  return (
    <div className="graph-container">
      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100%" }}
        layout={{
          name: "fcose", // Use fcose layout
          animate: true, // Enable smooth animations
          animationDuration: 800, // Faster animation duration (800ms)
          fit: true, // Fit the graph to the container
          padding: 30, // Extra space around the graph
          nodeRepulsion: 2000, // Increase node repulsion to spread nodes further apart
          idealEdgeLength: 150, // Add more space between connected nodes
          gravity: 0.1, // Lower gravity for a looser layout
          edgeElasticity: 0.2, // Allow edges to have slight flexibility
          randomize: false, // Start with a deterministic layout
          nestingFactor: 0.1, // Adjust spacing for hierarchical graphs
          avoidOverlap: true, // Prevent node overlaps
          nodeSeparation: 100, // Extra spacing between disconnected nodes
          uniformNodeDimensions: true, // Ensures nodes are treated uniformly
          tile: true, // Tiles disconnected components for better clarity
        }}
        stylesheet={[
          // General node style
          {
            selector: "node",
            style: {
              label: "data(label)",
              "font-family": "Prompt, sans-serif",
              "font-size": "12px",
              "text-valign": "center",
              "text-halign": "center",
              "background-color": "data(backgroundColor)", // Use precomputed color
              "border-color": "#3e2723",
              "border-width": 2,
              color: "#3e2723",
              "text-outline-color": "#FFFFFF",
              "text-outline-width": 2,
            },
          },

          // Root node style
          {
            selector: "node[id = 'root']",
            style: {
              "background-color": "#EBC49F",
              width: "70px",
              height: "70px",
              "border-color": "#D2691E",
              "border-width": "3px",
              "font-size": "14px",
              "font-weight": "bold",
              "text-wrap": "wrap",
              "text-max-width": "100px",
            },
          },
          // Main nodes with distinct colors
          {
            selector: "node[label='ฟังม่วน']",
            style: { "background-color": "#D2691E" }, // Orange
          },
          {
            selector: "node[label='เบิ่งม่วน']",
            style: { "background-color": "#A67B5B" }, // Blue
          },
          {
            selector: "node[label='กินม่วน']",
            style: { "background-color": "#8F9779" }, // Green
          },
          {
            selector: "node[label='เที่ยวม่วน']",
            style: { "background-color": "#E3B448" }, // Yellow
          },
          {
            selector: "node[label='ใช้ม่วน']",
            style: { "background-color": "#C19A6B" }, // Purple
          },
          // Child nodes inherit parent color dynamically
          {
            selector: "node[?parent]", // Matches nodes with a parent field
            style: {
              "background-color": (ele) => {
                const parent = ele.data("parent");
                switch (parent) {
                  case "ฟังม่วน":
                    return "#FF7043"; // Orange
                  case "เบิ่งม่วน":
                    return "#42A5F5"; // Blue
                  case "กินม่วน":
                    return "#66BB6A"; // Green
                  case "เที่ยวม่วน":
                    return "#FFCA28"; // Yellow
                  case "ใช้ม่วน":
                    return "#AB47BC"; // Purple
                  default:
                    return "#c19a6b"; // Default fallback color
                }
              },
            },
          },

          // Edge styles
          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": "#3e2723",
              "target-arrow-color": "#3e2723",
              "target-arrow-shape": "triangle",
            },
          },
        ]}
        cy={(cy) => {
          // Ensure new nodes inherit the parent node's label as their "parent" property
          cy.on("add", "node", (event) => {
            const newNode = event.target;
            const parent = newNode.connectedEdges().source(); // Find the source node
            if (parent) {
              newNode.data("parent", parent.data("label"));
            }
          });

          // Node click handler
          cy.on("tap", "node", handleNodeClick);
        }}
      />
    </div>
  );
};

export default GraphContainer;
