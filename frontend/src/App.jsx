import { useState, useEffect } from "react";
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
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // Color mapping for main nodes
  const getNodeColor = (mainDomain) => {
    switch (mainDomain) {
      case "ฟังม่วน":
        return "#D2691E"; // Chocolate
      case "เบิ่งม่วน":
        return "#A67B5B"; // Bronze
      case "กินม่วน":
        return "#8F9779"; // Olive Gray
      case "เที่ยวม่วน":
        return "#E3B448"; // Golden Sand
      case "ใช้ม่วน":
        return "#C19A6B"; // Light Brown
      default:
        return "#B88A4F"; // Default Muted Tan
    }
  };
  // Find the main domain by traversing parent links
  const findMainDomain = (nodeId, nodes) => {
    let currentNode = nodes.find((n) => n.data?.id === nodeId);
    while (currentNode && currentNode.data?.parent) {
      currentNode = nodes.find(
        (n) => n.data?.label === currentNode.data.parent
      );
      if (!currentNode) break;
    }
    return currentNode ? currentNode.data.label : null;
  };

  // Preprocess elements to assign background colors
  const preprocessElements = (elements) => {
    return elements.map((el) => {
      if (el.data && el.data.parent) {
        const mainDomain = findMainDomain(el.data.id, elements);
        return {
          ...el,
          data: { ...el.data, backgroundColor: getNodeColor(mainDomain) },
        };
      }
      return el;
    });
  };

  // Fetch graph data from backend
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
          position: node.position || undefined,
        }));
        const edges = response.data.edges.map((edge) => ({ data: edge }));
        setElements([...nodes, ...edges]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching graph data:", error);
        setError("Failed to load graph data");
        setLoading(false);
      });
  }, [apiBaseUrl]);

  // Add a new node
  const handleAddNode = async () => {
    if (!nodeName.trim()) {
      toast.error("Node name cannot be empty");
      return;
    }

    const newId = `node-${Date.now()}`;
    const referenceNode = selectedNodeId
      ? elements.find((el) => el.data.id === selectedNodeId)
      : null;

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

    try {
      await axios.post(`${apiBaseUrl}/graph`, {
        nodes: updatedElements
          .filter((el) => !el.data.source)
          .map((el) => ({ ...el.data, position: el.position || undefined })),
        edges: updatedElements
          .filter((el) => el.data.source)
          .map((el) => el.data),
      });
      toast.success("เพิ่มจุดความม่วนเรียบร้อย"); // Success toast
    } catch (error) {
      toast.error("Error adding new node. Please try again!"); // Error toast
      console.error("Error saving new node:", error);
    }

    setPopupOpen(false);
    setNodeName("");
  };

  // Delete a node
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
            .map((el) => ({ ...el.data, position: el.position || undefined })),
          edges: updatedElements
            .filter((el) => el.data.source)
            .map((el) => el.data),
        });
        toast.success("ลบสำเร็จแล้ว"); // Success toast
      } catch (error) {
        toast.error("Error deleting node. Please try again!"); // Error toast
        console.error("Error deleting node:", error);
      }

      setPopupOpen(false);
      setSelectedNodeId(null);
    }
  };

  return (
    <div className="app">
      {loading && <p>กำลังโหลดข้อมูล...</p>}
      {error && <p className="error">{error}</p>}
      <Sidebar />
      <GraphContainer
        elements={preprocessElements(elements)}
        handleNodeClick={(event) => {
          const node = event.target.data();
          setSelectedNodeId(node.id);
          setNodeName(node.label || "");
          setPopupOpen(true);
        }}
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
      <ToastContainer
        className="custom-toast-container" /* Add your custom class */
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
