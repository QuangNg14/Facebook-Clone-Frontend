import React, { useState, useEffect } from "react";
import "./user.css";

function UserProfile(props) {
  const {
    currentUser,
    followedUsers,
    setFollowedUsers,
    handleUnfollow,
    followError,
    followUpdateTrigger,
  } = props;
  const [statusHeadline, setStatusHeadline] = useState(currentUser?.headline);
  const [inputValue, setInputValue] = useState("");

  const handleUpdateStatus = async () => {
    try {
      // Check if the input value is not empty
      if (!inputValue.trim()) {
        throw new Error("Headline is required");
      }

      // API call to update the headline
      const response = await fetch(
        "https://ricecomp431app-5b7591b01f3b.herokuapp.com/headline",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ headline: inputValue }),
        }
      );

      const data = await response.json();

      // Check for a successful response
      if (!response.ok) {
        throw new Error(data.message || "Error updating headline");
      }

      // Update the local state with the new headline
      setStatusHeadline(inputValue);

      // Optionally, you can handle the success case (e.g., showing a success message)
      console.log("Headline updated:", data);
    } catch (error) {
      // Handle any errors
      console.error("Error updating headline:", error);
      // Optionally, update the state to show an error message
    }

    // Clear the input field
    setInputValue("");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://ricecomp431app-5b7591b01f3b.herokuapp.com/followed-users",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch followedUsers");
        }

        const result = await response.json();
        setFollowedUsers(result?.followedUsers);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };
    fetchPosts();
  }, [setFollowedUsers, followUpdateTrigger]);

  return (
    <div>
      <div className="profile">
        <div className="avatar-box">
          <img src={currentUser?.avatar} alt="User Avatar" className="avatar" />
        </div>
        <div className="user-info">
          <h2>{currentUser?.username}</h2>
          <p>{statusHeadline || currentUser?.headline}</p>
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
          Add the username of the user you want to follow
        </h5>
        {followError && (
          <div
            style={{
              color: "red",
              padding: "10px",
              margin: "10px 0",
              textAlign: "center",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            {followError}
          </div>
        )}
        {followedUsers &&
          followedUsers.map((user) => (
            <div key={user?._id} className="avatar-box">
              <img
                src="https://learn.corel.com/wp-content/uploads/2022/01/alberta-2297204_1280.jpg"
                alt={`${user?.username} Avatar`}
                className="avatar"
              />
              <h3>{user?.username}</h3>
              <p>{statusHeadline}</p>{" "}
              <button
                data-testid="unfollow-user-button"
                onClick={() => handleUnfollow(user?.user)}
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
