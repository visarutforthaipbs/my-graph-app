import PropTypes from "prop-types";
import "./PopupForm.css";

const PopupForm = ({
  onClose,
  onSubmit,
  onDelete,
  nodeName,
  setNodeName,
  nodeId,
}) => {
  const handleSubmit = () => {
    if (!nodeName.trim()) {
      alert("กรุณาใส่สิ่งที่คิดว่าเป็นความม่วน!");
      return;
    }
    onSubmit();
  };

  return (
    <div className="popup" role="dialog" aria-labelledby="popup-header">
      <div className="popup-content">
        <h2 id="popup-header" className="popup-header">
          {nodeId ? "เพิ่มความม่วน" : "Add Node"}
        </h2>
        <input
          className="popup-input"
          type="text"
          placeholder={
            nodeId ? "แก้ไขข้อความ" : "ใส่สิ่งที่คิดว่าเป็นความม่วนของเฮา"
          }
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && nodeName.trim()) {
              handleSubmit();
            }
          }}
          aria-label="Node Name"
        />
        <div className="popup-buttons">
          <button
            className="popup-button popup-submit"
            onClick={handleSubmit}
            aria-label="Submit Node"
          >
            {nodeId ? "เพิ่ม" : "Add"}
          </button>
          {nodeId && (
            <button
              className="popup-button popup-delete"
              onClick={() => {
                if (confirm("คุณต้องการลบข้อความนี้หรือไม่?")) {
                  onDelete();
                }
              }}
              aria-label="Delete Node"
            >
              ลบ
            </button>
          )}
          <button
            className="popup-button popup-cancel"
            onClick={onClose}
            aria-label="Close Popup"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

PopupForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  nodeName: PropTypes.string.isRequired,
  setNodeName: PropTypes.func.isRequired,
  nodeId: PropTypes.string,
};

export default PopupForm;
