import { useState, useEffect } from "react";
import GraphContainer from "./components/GraphContainer";
import Sidebar from "./components/Sidebar";
import LogoFooter from "./components/LogoFooter";
import PopupForm from "./components/PopupForm";
import axios from "axios";
import "./App.css";

const App = () => {
  const [elements, setElements] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [nodeName, setNodeName] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch graph data from the backend
  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/graph`)
      .then((response) => {
        const nodes = response.data.nodes.map((node) => ({
          data: node,
          position: node.position || undefined, // Ensure position is set
        }));
        const edges = response.data.edges.map((edge) => ({
          data: edge,
        }));

        // Check if the main node is missing
        const hasMainNode = nodes.some((node) => node.data.id === "root");

        if (!hasMainNode) {
          const mainNode = {
            data: {
              id: "root",
              label: "พลังความม่วนของคนอีสาน",
            },
            position: { x: 300, y: 300 },
          };
          nodes.push(mainNode);
        }

        setElements([...nodes, ...edges]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching graph data:", error);
        setError("Failed to load graph data");
        setLoading(false);
      });
  }, [apiBaseUrl]);

  const generateUniquePosition = () => {
    let x, y;
    let isOverlapping;
    do {
      x = Math.random() * 500;
      y = Math.random() * 500;
      isOverlapping = elements.some((el) => {
        const position = el.position;
        return (
          position &&
          Math.abs(position.x - x) < 150 &&
          Math.abs(position.y - y) < 250
        );
      });
    } while (isOverlapping);
    return { x, y };
  };

  const handleAddNode = async () => {
    if (!nodeName.trim()) {
      alert("Node name cannot be empty");
      return;
    }

    const newId = `node-${elements.filter((el) => !el.data.source).length + 1}`;
    const referenceNode = selectedNodeId
      ? elements.find((el) => el.data.id === selectedNodeId)
      : null;

    const newNode = {
      data: { id: newId, label: nodeName },
      position: referenceNode
        ? {
            x: referenceNode.position.x + 50,
            y: referenceNode.position.y + 50,
          }
        : generateUniquePosition(),
    };
    const newEdge = selectedNodeId
      ? { data: { source: selectedNodeId, target: newId } }
      : null;

    const updatedElements = newEdge
      ? [...elements, newNode, newEdge]
      : [...elements, newNode];

    setElements(updatedElements);

    try {
      await axios.post(`${apiBaseUrl}/graph`, {
        nodes: updatedElements
          .filter((el) => !el.data.source)
          .map((el) => ({
            ...el.data,
            position: el.position || undefined,
          })),
        edges: updatedElements
          .filter((el) => el.data.source)
          .map((el) => el.data),
      });
      console.log("New node and edges saved successfully");
    } catch (error) {
      console.error("Error saving new node:", error);
    }

    setPopupOpen(false);
    setNodeName("");
  };

  const handleDeleteNode = async () => {
    if (selectedNodeId) {
      const updatedElements = elements.filter(
        (el) =>
          el.data.id !== selectedNodeId &&
          el.data.source !== selectedNodeId &&
          el.data.target !== selectedNodeId
      );
      setElements(updatedElements);

      try {
        await axios.post(`${apiBaseUrl}/graph`, {
          nodes: updatedElements
            .filter((el) => !el.data.source)
            .map((el) => ({
              ...el.data,
              position: el.position || undefined,
            })),
          edges: updatedElements
            .filter((el) => el.data.source)
            .map((el) => el.data),
        });
        console.log("Node and edges deleted successfully");
      } catch (error) {
        console.error("Error deleting node:", error);
      }

      setPopupOpen(false);
      setSelectedNodeId(null);
    }
  };

  const updateNodePositions = async (updatedElements) => {
    const nodes = updatedElements.filter((el) => !el.data.source);
    const edges = updatedElements.filter((el) => el.data.source);

    setElements(updatedElements);

    try {
      await axios.post(`${apiBaseUrl}/graph`, {
        nodes: nodes.map((node) => ({
          ...node.data,
          position: node.position || undefined,
        })),
        edges: edges.map((edge) => edge.data),
      });
      console.log("Node positions updated successfully");
    } catch (error) {
      console.error("Error updating node positions:", error);
    }
  };

  return (
    <div className="app">
      {loading && <p>Loading graph data...</p>}
      {error && <p className="error">{error}</p>}
      <Sidebar />
      <GraphContainer
        elements={elements}
        handleNodeClick={(event) => {
          const node = event.target.data();
          setSelectedNodeId(node.id);
          setNodeName(node.label || "");
          setPopupOpen(true);
        }}
        updateNodePositions={updateNodePositions}
      />
      {popupOpen && (
        <PopupForm
          onClose={() => setPopupOpen(false)}
          onSubmit={handleAddNode}
          onDelete={handleDeleteNode}
          nodeName={nodeName}
          setNodeName={setNodeName}
          nodeId={selectedNodeId}
        />
      )}
      <LogoFooter />
    </div>
  );
};

export default App;
