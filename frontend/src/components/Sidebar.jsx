import { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle(!isOpen);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button
        className="sidebar-toggle"
        onClick={handleToggle}
        aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        {isOpen ? "❮" : "❯"}
      </button>
      {isOpen && (
        <div>
          <div className="sidebar-logo">
            <img
              src="/logo-gif-4.gif"
              alt="Animated Logo"
              className="sidebar-logo-image"
            />
          </div>
          <h1 className="sidebar-title">
            พลัง<strong>ความม่วน</strong>ของบ้านเฮามีหยังแหน่?
          </h1>
          <p className="sidebar-text">
            อีหยังแหน่ที่เฮา อยากอวด อยากอ้าง ชาวบ้านชาวช่อง
            อีหยังแหน่ที่จะเฮาอยากเอาไปเผยแพร่ ส่งออก มาร่วมกัน คิดต่อ ปักหมุด
            ความม่วนบ้านเฮา
          </p>
          <p className="sidebar-text">
            เพิ่มจุดพลังความม่วน ด้วยการกดที่แต่ละจุดที่อยากเติมเพิ่มได้เลย!
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
