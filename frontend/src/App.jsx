import { useState, useEffect, useMemo } from "react";
import GraphContainer from "./components/GraphContainer";
import Sidebar from "./components/Sidebar";
import LogoFooter from "./components/LogoFooter";
import PopupForm from "./components/PopupForm";
import axios from "axios";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [elements, setElements] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [nodeName, setNodeName] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Manage sidebar state
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const handleError = (errMsg) => {
    setError(errMsg);
    toast.error(errMsg);
    setTimeout(() => setError(null), 5000); // Reset error after 5 seconds
  };

  const getNodeColor = (mainDomain) => {
    switch (mainDomain) {
      case "ฟังม่วน":
        return "#D2691E";
      case "เบิ่งม่วน":
        return "#A67B5B";
      case "กินม่วน":
        return "#8F9779";
      case "เที่ยวม่วน":
        return "#E3B448";
      case "ใช้ม่วน":
        return "#C19A6B";
      default:
        return "#B88A4F";
    }
  };

  const findMainDomain = (nodeId, nodes) => {
    let currentNode = nodes.find((n) => n.data?.id === nodeId);
    while (currentNode && currentNode.data?.parent) {
      currentNode = nodes.find(
        (n) => n.data?.label === currentNode.data.parent
      );
    }
    return currentNode ? currentNode.data.label : null;
  };

  const preprocessElements = (elements) => {
    return elements.map((el) => {
      if (el.data?.parent) {
        const mainDomain = findMainDomain(el.data.id, elements);
        return {
          ...el,
          data: { ...el.data, backgroundColor: getNodeColor(mainDomain) },
        };
      }
      return el;
    });
  };

  const processedElements = useMemo(
    () => preprocessElements(elements),
    [elements]
  );

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/graph`)
      .then((response) => {
        const nodes = response.data.nodes.map((node) => ({
          data: {
            ...node,
            backgroundColor: getNodeColor(
              findMainDomain(node.id, response.data.nodes)
            ),
          },
          position: node.position || {
            x: Math.random() * 800,
            y: Math.random() * 600,
          },
        }));
        const edges = response.data.edges.map((edge) => ({ data: edge }));
        setElements([...nodes, ...edges]);
        setLoading(false);
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message || "Failed to load graph data";
        handleError(errMsg);
        setLoading(false);
      });
  }, [apiBaseUrl]);

  const handleAddNode = async () => {
    if (!nodeName.trim()) {
      toast.error("Node name cannot be empty");
      return;
    }

    const existingNode = elements.find((el) => el.data?.label === nodeName);
    if (existingNode) {
      toast.error("Node with this name already exists");
      return;
    }

    const newId = `node-${Date.now()}`;
    const referenceNode = elements.find((el) => el.data.id === selectedNodeId);
    const mainDomain = referenceNode
      ? findMainDomain(referenceNode.data.id, elements)
      : null;

    const newNode = {
      data: {
        id: newId,
        label: nodeName,
        parent: referenceNode ? referenceNode.data.label : null,
        backgroundColor: getNodeColor(mainDomain),
      },
      position: referenceNode
        ? { x: referenceNode.position.x + 50, y: referenceNode.position.y + 50 }
        : { x: Math.random() * 500, y: Math.random() * 500 },
    };

    const newEdge = selectedNodeId
      ? { data: { source: selectedNodeId, target: newId } }
      : null;
    const updatedElements = newEdge
      ? [...elements, newNode, newEdge]
      : [...elements, newNode];

    setElements(updatedElements);

    await axios
      .post(`${apiBaseUrl}/graph`, {
        nodes: updatedElements
          .filter((el) => !el.data.source)
          .map((el) => ({ ...el.data, position: el.position })),
        edges: updatedElements
          .filter((el) => el.data.source)
          .map((el) => el.data),
      })
      .then(() => toast.success("Node added successfully"))
      .catch(() => toast.error("Error adding node"));

    setPopupOpen(false);
    setNodeName("");
  };

  const handleDeleteNode = async () => {
    const updatedElements = elements.filter(
      (el) =>
        el.data.id !== selectedNodeId &&
        el.data.source !== selectedNodeId &&
        el.data.target !== selectedNodeId
    );
    setElements(updatedElements);

    await axios
      .post(`${apiBaseUrl}/graph`, {
        nodes: updatedElements
          .filter((el) => !el.data.source)
          .map((el) => ({ ...el.data, position: el.position })),
        edges: updatedElements
          .filter((el) => el.data.source)
          .map((el) => el.data),
      })
      .then(() => toast.success("Node deleted successfully"))
      .catch(() => toast.error("Error deleting node"));

    setPopupOpen(false);
    setSelectedNodeId(null);
  };

  return (
    <div className="app">
      {loading && <div className="loading-spinner"></div>}
      {error && <p className="error">{error}</p>}
      <Sidebar
        onToggle={(isOpen) => {
          setIsSidebarOpen(isOpen);
          document.body.style.marginLeft = isOpen ? "0px" : "0"; // Adjust layout dynamically
        }}
      />

      <div
        className="graph-container-wrapper"
        style={{
          marginLeft: isSidebarOpen ? "280px" : "0",
          transition: "margin 0.3s",
        }}
      >
        <GraphContainer
          elements={processedElements}
          handleNodeClick={(event) => {
            const node = event.target.data();
            setSelectedNodeId(node.id);
            setNodeName(node.label || "");
            setPopupOpen(true);
          }}
        />
      </div>
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
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default App;
