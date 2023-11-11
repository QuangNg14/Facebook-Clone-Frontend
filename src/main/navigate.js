import React from "react";
import { Link } from "react-router-dom";

const NavigateComponent = ({ handleLogout }) => {
  return (
    <div>
      <button className="link-button">
        <Link to="/profile" className="link-text">
          Profile
        </Link>
      </button>
      <button className="link-button" data-testid="logout-button">
        <Link to="/" className="link-text" onClick={handleLogout}>
          Logout
        </Link>
      </button>
    </div>
  );
};

export default NavigateComponent;
