import React, { useState } from "react";
import "./profile.css";
import { Link } from "react-router-dom";
function Profile() {
  const [newArticleImage, setNewArticleImage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "Quang Nguyen",
    email: "abc@example.com",
    phone: "1231231234",
    zip: "77005",
  });

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleUpdateInfo = () => {
    setUserInfo({
      name: formValues.name || userInfo.name,
      email: formValues.email || userInfo.email,
      phone: formValues.phone || userInfo.phone,
      zip: formValues.zip || userInfo.zip,
    });
    setFormValues({ name: "", email: "", phone: "", zip: "", password: "" });
  };

  const handleFileChange = (event) => {
    setNewArticleImage(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="profile-container">
      <div className="info-section">
        <button className="link-button">
          <Link to="/main" className="link-text">
            Main
          </Link>
        </button>
        <div className="avatar-box">
          <img
            src="https://cdn.pixabay.com/photo/2012/03/01/00/55/flowers-19830_1280.jpg"
            alt="User Avatar"
            className="avatar"
          />
        </div>
        <label className="file-label">
          Upload Image
          <input
            type="file"
            className="file-input"
            onChange={handleFileChange}
          />
        </label>
        <h2>Current Info</h2>
        <p>Username: {userInfo.name}</p>
        <p>Email: {userInfo.email}</p>
        <p>Phone: {userInfo.phone}</p>
        <p>Zip Code: {userInfo.zip}</p>
      </div>
      <div className="form-section">
        <h2>Update Info</h2>
        <form>
          <label>
            Name:
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formValues.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formValues.phone}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Zip Code:
            <input
              type="text"
              name="zip"
              placeholder="Zip Code"
              value={formValues.zip}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleInputChange}
            />
          </label>
          <button type="button" onClick={handleUpdateInfo}>
            Update Info
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
