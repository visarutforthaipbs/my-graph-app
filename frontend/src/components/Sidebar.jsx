import "./Sidebar.css"; // Import custom styles

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1 className="sidebar-title">
        พลัง<strong>ความม่วน</strong>ของบ้านเฮามีหยังแหน่?
      </h1>
      <p className="sidebar-text">
        หากจะหาว่าอะไรบ้างที่จะสามารถเป็น softpower ของภาคอีสานได้
        เราคงต้องเริ่มจากการสอบถามคนอีสานด้วยกันเอง และสิ่งที่จะสามารถเป็น
        softpower หรือ creative asset ที่จะสามารถส่งออกไปยังต่างประเทศ
        ไม่ว่าจะเป็นด้านเศรษฐกิจหรือการเมือง อย่างน้อยๆ ก็ต้องเริ่มจาก
        <b>ความม่วน</b>
      </p>
      <p className="sidebar-text">
        เพิ่มจุดพลังความม่วน ด้วยการกดที่แต่ล่ะจุดที่อยากเติมเพิ่มได้เลย
        และพาอีสานไปสู่โลกกันเลย
      </p>
    </div>
  );
};

export default Sidebar;
