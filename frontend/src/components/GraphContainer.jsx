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
          name: "fcose",
          animate: true,
          animationDuration: 1000,
          fit: true,
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
              "background-color": "#c19a6b", // Default earth tone
              "border-color": "#3e2723",
              "border-width": 2,
              color: "#3e2723",
              "text-outline-color": "#FFFFFF", // White outline for text
              "text-outline-width": 2, // Width of the outline
            },
          },
          // Specific subdomain node styles
          {
            selector:
              "node[id = 'node-2'], node[id = 'node-3'], node[id = 'node-4'], node[id = 'node-5'], node[id = 'node-6']",
            style: {
              "background-color": "#6b8e23", // Different earth tone for subdomains
              "text-max-width": "100px",
            },
          },
          // Specific main-domain node styles
          {
            selector: "node[id = 'root']",
            style: {
              "background-color": "#EBC49F",
              width: "70px", // Increased size for the main domain
              height: "70px",
              "border-color": "#D2691E", // Optional border to highlight
              "border-width": "3px",
              "font-size": "14px", // Larger font size for better visibility
              "font-weight": "bold", // Bold text for emphasis
              "text-wrap": "wrap", // Allow text to wrap
              "text-max-width": "100px", // Limit the width of wrapped text
              "text-outline-color": "#FFFFFF", // White outline for text
              "text-outline-width": 2, // Width of the outline
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
          // Child edge styles
          {
            selector: "edge[type='child']",
            style: {
              "line-color": "#d95f62",
            },
          },
        ]}
        cy={(cy) => {
          cy.on("tap", "node", handleNodeClick);
        }}
      />
    </div>
  );
};

export default GraphContainer;
