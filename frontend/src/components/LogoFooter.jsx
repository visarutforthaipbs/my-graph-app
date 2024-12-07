import reactLogo from "../assets/pilogosvg.svg";
import "./LogoFooter.css"; // Assuming this is your CSS file

const LogoFooter = () => {
  return (
    <div className="footer">
      <p></p>
      <img src={reactLogo} alt="Kittor Logo" className="footer-logo" />
    </div>
  );
};

export default LogoFooter;
