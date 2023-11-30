import React, { useEffect, useState } from "react";
import "./profile.css";
import { Link } from "react-router-dom";
function Profile() {
  const [newArticleImage, setNewArticleImage] = useState(null);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    zipcode: "",
    password: "",
  });

  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState(user?.avatar);
  const [err, setErr] = useState({ message: "" });

  const [userInfo, setUserInfo] = useState({
    name: user?.username,
    email: user?.email,
    phone: user?.phone,
    zipcode: user?.zipcode,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    // Validate all fields are filled
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key])
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email))
      newErrors.email = "Email is not valid";

    if (!/^\d{10}$/.test(formValues.phone))
      newErrors.phone = "Phone number must be 10 digits";

    if (!/^\d{5}$/.test(formValues.zipcode))
      newErrors.zipcode = "Zipcode must be 5 digits";

    if (formValues.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErr(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateInfo = async () => {
    const updateUserInfo = async (endpoint, data) => {
      try {
        const response = await fetch(`http://localhost:3000/${endpoint}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error updating user info");
        }

        return response.json();
      } catch (error) {
        console.error(`Error updating ${endpoint}:`, error);
      }
    };

    try {
      if (validate()) {
        setErr({});
        if (formValues.phone) {
          await updateUserInfo("phone", { phone: formValues.phone });
        }

        if (formValues.password) {
          await updateUserInfo("password", { password: formValues.password });
        }

        if (formValues.zipcode) {
          await updateUserInfo("zipcode", { zipcode: formValues.zipcode });
        }

        if (formValues.email) {
          await updateUserInfo("email", { email: formValues.email });
        }

        setUserInfo({
          ...userInfo,
          name: formValues.name || userInfo.name,
          email: formValues.email || userInfo.email,
          phone: formValues.phone || userInfo.phone,
          zipcode: formValues.zipcode || userInfo.zipcode,
          password: formValues.password || userInfo.password,
        });

        setFormValues({
          name: "",
          email: "",
          phone: "",
          zipcode: "",
          password: "",
        });
      } else {
        console.log("Error updating user info");
        console.log(err);
        // setErr({ message: "Error updating user info" });
      }
    } catch (error) {
      console.log(error);
      setErr({ message: error.message });
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await fetch("http://localhost:3000/avatar", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      setImageURL(data?.avatar);

      if (!response.ok) {
        throw new Error(data.message || "Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // const handleFileChange = (event) => {
  //   setNewArticleImage(URL.createObjectURL(event.target.files[0]));
  // };

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("loginUser");
    const fetchUser = async () => {
      if (userFromLocalStorage) {
        try {
          const response = await fetch(
            `http://localhost:3000/userprofile/${userFromLocalStorage}`
          );
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Handle errors (e.g., user not found, server error)
            console.error("Error fetching user:", response.status);
          }
        } catch (error) {
          console.error("Network error:", error);
        }
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <div className="profile-container">
      <div className="info-section">
        <Link to="/main" className="link-text">
          <button className="link-button">Main</button>
        </Link>
        <div className="avatar-box">
          <img
            src={imageURL || user?.avatar}
            alt="User Avatar"
            className="avatar"
          />
        </div>
        <input type="file" onChange={handleFileChange} />
        <button
          className="button"
          style={{ height: 70 }}
          onClick={handleUpload}
        >
          Upload Image
        </button>
        <h2>Current Info</h2>
        <p>Username: {userInfo.name || user?.username}</p>
        <p>Email: {userInfo.email || user?.email}</p>
        <p>Phone: {userInfo.phone || user?.phone}</p>
        <p>Zip Code: {userInfo.zipcode || user?.zipcode}</p>
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
              name="zipcode"
              placeholder="Zip Code"
              value={formValues.zipcode}
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
          {err.message && <p style={{ color: "red" }}>{err.message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Profile;
