import React, { useState, useEffect } from "react";
import "./user.css";

function UserProfile(props) {
  const { followedUsers, setFollowedUsers, handleUnfollow } = props;
  const [statusHeadline, setStatusHeadline] = useState("Hello world");
  const [inputValue, setInputValue] = useState("");

  const handleUpdateStatus = () => {
    setStatusHeadline(inputValue);
    setInputValue("");
  };

  return (
    <div>
      <div className="profile">
        <div className="avatar-box">
          <img
            src="https://cdn.pixabay.com/photo/2012/03/01/00/55/flowers-19830_1280.jpg"
            alt="User Avatar"
            className="avatar"
          />
        </div>
        <div className="user-info">
          <h2>Username</h2>
          <p>{statusHeadline}</p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter new status"
          />
          <button onClick={handleUpdateStatus}>Update</button>
        </div>
      </div>

      <div className="sidebar">
        <h5 style={{ alignSelf: "center" }}>
          Add the IDs of JSON Placeholder Users
        </h5>
        {followedUsers &&
          followedUsers.map((user) => (
            <div key={user?.id} className="avatar-box">
              <img
                src="https://learn.corel.com/wp-content/uploads/2022/01/alberta-2297204_1280.jpg"
                alt={`${user?.name} Avatar`}
                className="avatar"
              />
              <h3>{user?.name}</h3>
              <p>{user?.company.bs}</p>{" "}
              <button
                data-testid="unfollow-user-button"
                onClick={() => handleUnfollow(user?.id)}
              >
                Unfollow
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default UserProfile;
