import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import axios from "axios"; // Import axios
import "./GraphContainer.css";

// Initialize fcose layout
Cytoscape.use(fcose);

const GraphContainer = ({ elements, handleNodeClick }) => {
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="graph-container">
      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100%" }}
        layout={{
          name: "preset", // Keep preset layout for predefined positions
          animate: true,
          animationDuration: 900,
          fit: true,
          padding: 50,
        }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              "font-family": "Prompt, sans-serif",
              "font-size": "12px",
              "text-valign": "center",
              "text-halign": "center",
              "background-color": "data(backgroundColor)",
              "border-color": "#003C92",
              "border-width": 2,
              color: "#003C92",
              "text-outline-color": "#FFFFFF",
              "text-outline-width": 2,
            },
          },
          // Root node style
          {
            selector: "node[id='root']", // Match the root node
            style: {
              "background-color": "#003C92",
              width: "70px", // Increase size
              height: "70px", // Increase size
              "font-size": "16px", // Increase font size
              "border-width": 4, // Thicker border
              "border-color": "#003C92",
              "font-weight": "bold",
            },
          },

          // Main node styles (กินม่วน, ฟังม่วน, ใช้ม่วน, เบิ่งม่วน, เที่ยวม่วน)
          {
            selector:
              "node[label='กินม่วน'], node[label='ฟังม่วน'], node[label='ใช้ม่วน'], node[label='เบิ่งม่วน'], node[label='เที่ยวม่วน']",
            style: {
              "background-color": "#F4EB25", // Golden color for main nodes
              width: "50px", // Slightly larger size
              height: "50px",
              "font-size": "14px", // Bigger font size
              "border-width": 3, // Thicker border
              "border-color": "#F4EB25", // Distinct border color
              "font-weight": "bold",
            },
          },
          {
            selector: "edge",
            style: {
              width: 3,
              "curve-style": "straight-triangle",
              "line-color": "#003C92", // Your desired edge color
              "target-arrow-shape": "triangle", // Add arrow for direction
              "target-arrow-color": "#003C92", // Color for the arrow
            },
          },
        ]}
        cy={(cy) => {
          // Handle node clicks
          cy.on("tap", "node", handleNodeClick);

          // Save node position on drag
          cy.on("dragfree", "node", async (event) => {
            const node = event.target;
            const newPosition = node.position();
            const nodeId = node.id();

            try {
              await axios.post(`${apiBaseUrl}/update-node-position`, {
                id: nodeId,
                position: newPosition,
              });
              console.log(`Node position updated: ${nodeId}`, newPosition);
            } catch (error) {
              console.error(
                `Error updating position for node ${nodeId}:`,
                error
              );
            }
          });

          // Handle errors
          cy.on("error", (event) => {
            console.error("Cytoscape error:", event);
          });
        }}
      />
    </div>
  );
};

export default GraphContainer;
