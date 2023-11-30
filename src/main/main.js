// main.js
import React, { useState, useEffect, useContext } from "react";
import Post from "./post";
import "./main.css";
import UserProfile from "./user";
import { UserContext } from "../context/userContext";
import NavigateComponent from "./navigate";
import Form from "react-bootstrap/Form";

const images = [
  "https://cdn.pixabay.com/photo/2017/02/08/17/24/fantasy-2049567_1280.jpg",
  "https://cdn.pixabay.com/photo/2012/03/01/00/55/flowers-19830_1280.jpg",
  "https://learn.corel.com/wp-content/uploads/2022/01/alberta-2297204_1280.jpg",
  "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
  "https://cdn.pixabay.com/photo/2013/10/02/23/03/mountains-190055_1280.jpg",
  "https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_1280.jpg",
  "https://cdn.pixabay.com/photo/2015/06/19/21/24/avenue-815297_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/01/08/11/57/butterflies-1127666_1280.jpg",
  "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg",
  "https://wallpapercave.com/wp/LdTAvbA.jpg",
  "https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_1280.jpg",
  "https://cdn.pixabay.com/photo/2015/12/01/20/28/forest-1072828_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_1280.jpg",
  "https://cdn.pixabay.com/photo/2012/08/06/00/53/bridge-53769_1280.jpg",
  "https://cdn.pixabay.com/photo/2018/11/17/22/15/trees-3822149_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/04/14/20/11/pink-324175_1280.jpg",
  "https://cdn.pixabay.com/photo/2018/08/23/07/35/thunderstorm-3625405_1280.jpg",
  "https://cdn.pixabay.com/photo/2013/07/18/20/26/sea-164989_1280.jpg",
];

const Main = () => {
  const [articles, setArticles] = useState([]);
  const [newArticleContent, setNewArticleContent] = useState("");
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleImage, setNewArticleImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [followedUsers, setFollowedUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [followUpdateTrigger, setFollowUpdateTrigger] = useState(0);
  const [headline, setHeadline] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [articleImageURL, setArticleImageURL] = useState("");
  const [googleLoginUserName, setGoogleLoginUserName] = useState("");

  const [
    user,
    setUser,
    registeredUsers,
    setRegisteredUsers,
    loginState,
    setLoginState,
  ] = useContext(UserContext);

  const [followError, setFollowError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(articles.length / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handleNext = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages));
  };

  const handlePrevious = () => {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          onClick={() => setCurrentPage(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </li>
      );
    }
    return pageNumbers;
  };

  // useEffect(() => {
  //   const userFromLocalStorage = localStorage.getItem("loginUser");
  //   if (userFromLocalStorage) {
  //     setUser(JSON.parse(userFromLocalStorage));
  //   }
  // }, [setUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        "https://ricecomp431app-5b7591b01f3b.herokuapp.com/current_user",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated) {
          setGoogleLoginUserName(data.user.username);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("loginUser");
    const fetchUser = async () => {
      if (userFromLocalStorage) {
        try {
          const response = await fetch(
            `https://ricecomp431app-5b7591b01f3b.herokuapp.com/userprofile/${userFromLocalStorage}`
          );
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error("Error fetching user:", response.status);
          }
        } catch (error) {
          console.error("Network error:", error);
        }
      }
    };

    fetchUser();
  }, [setUser]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://ricecomp431app-5b7591b01f3b.herokuapp.com/articles",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const result = await response.json();
        setArticles(result?.articles);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };
    fetchPosts();
  }, [followedUsers, user, followUpdateTrigger]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://ricecomp431app-5b7591b01f3b.herokuapp.com/all-users",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  // const handlePostArticle = () => {
  //   const newArticle = {
  //     userId: user.user,
  //     id: articles.length + 2,
  //     title: newArticleTitle,
  //     body: newArticleContent,
  //     image: newArticleImage,
  //   };
  //   createArticle({
  //     title: newArticleTitle,
  //     text: newArticleContent,
  //   });
  //   setArticles([newArticle].concat(articles));
  //   setNewArticleContent("");
  //   setNewArticleTitle("");
  // };

  const handlePostArticle = async () => {
    try {
      const articleData = {
        title: newArticleTitle,
        text: newArticleContent,
        image: newArticleImage,
        // Include any other necessary fields
      };

      const response = await fetch(
        "https://ricecomp431app-5b7591b01f3b.herokuapp.com/article",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(articleData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating article");
      }

      const data = await response.json();
      const newArticle = {
        ...data.newArticle,
        id: articles.length + 2,
        image: newArticleImage,
      };

      setArticles([newArticle].concat(articles));
      setNewArticleContent("");
      setNewArticleTitle("");
    } catch (error) {
      console.error("Error posting article:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFileChange = (event) => {
    setNewArticleImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleFollow = async () => {
    if (!followedUsers.some((user) => user.username === newUsername)) {
      try {
        const response = await fetch(
          `https://ricecomp431app-5b7591b01f3b.herokuapp.com/following/${newUsername}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to follow user");
        }

        const updatedFollowedUsers = await response.json();
        // setFollowedUsers(updatedFollowedUsers.followedUsers);
        setFollowUpdateTrigger((prev) => prev + 1);
        setNewUsername("");
        setFollowError("");
      } catch (error) {
        console.error("There was an error following the user!", error);
        setFollowError("Error following user. Please try again.");
      }
    } else {
      setFollowError("Invalid username. Please enter a valid username.");
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const response = await fetch(
        `https://ricecomp431app-5b7591b01f3b.herokuapp.com/following/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unfollow user");
      }

      const updatedFollowedUsers = await response.json();
      setFollowUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("There was an error unfollowing the user!", error);
      // Handle error (show a message, etc.)
    }
  };

  const createArticle = async (articleData) => {
    try {
      const response = await fetch(
        "https://ricecomp431app-5b7591b01f3b.herokuapp.com/article",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(articleData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create article: ${response.status}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  const handleLogout = () => {
    setLoginState("loggedOut");
    localStorage.setItem("loginState", "loggedOut");
    localStorage.removeItem("loginUser");
  };

  return (
    <div className="main-view">
      <div className="user-view">
        <NavigateComponent handleLogout={handleLogout} />

        <UserProfile
          followedUsers={followedUsers}
          setFollowedUsers={setFollowedUsers}
          handleUnfollow={handleUnfollow}
          followError={followError}
          currentUser={user}
          followUpdateTrigger={followUpdateTrigger}
        />
        <div className="sidebar">
          <input
            type="text"
            placeholder="Add"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            data-testid="follow-user"
          />
          <button onClick={handleFollow} data-testid="follow-user-button">
            Follow
          </button>
          <div style={{ marginTop: 10 }}>
            <h5>List of Friends</h5>
            <ul className="list-group">
              {error && <li className="list-group-item">Error: {error}</li>}
              {users.map((user, index) => (
                <li
                  key={index}
                  className="list-group-item"
                  style={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {user?.username}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {userData && (
          <div className="user-info">
            <img src="https://via.placeholder.com/50" alt="User" />
            <p>{userData.name}</p>
            <p>{userData.company.catchPhrase}</p>
          </div>
        )}
      </div>

      <div className="post-view">
        <div className="new-post">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "85%",
              height: "100%",
            }}
          >
            <h4>Title</h4>
            <textarea
              value={newArticleTitle}
              onChange={(e) => setNewArticleTitle(e.target.value)}
              style={{ width: "100%", height: "20%" }}
            />
            <h4>Body</h4>
            <textarea
              value={newArticleContent}
              onChange={(e) => setNewArticleContent(e.target.value)}
              style={{ width: "100%", height: "80%" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "10%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <label className="file-label">
              Upload Image
              <input
                type="file"
                className="file-input"
                onChange={handleFileChange}
              />
            </label>
            <button className="button" onClick={handlePostArticle}>
              Post
            </button>
            <button
              className="button"
              onClick={() => {
                setNewArticleContent("");
                setNewArticleTitle("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
          data-testid="search-article"
        />

        <div className="articles-feed" data-testid="articles-feed">
          {currentArticles
            .filter((article) => {
              const normalizedSearchTerm = searchTerm
                ?.toLowerCase()
                .replace(/\s+/g, "");
              const normalizedTitle = article.title
                ?.toLowerCase()
                .replace(/\s+/g, "");
              const normalizedBody = article.text
                ?.toLowerCase()
                .replace(/\s+/g, "");

              return (
                normalizedTitle.includes(normalizedSearchTerm) ||
                normalizedBody.includes(normalizedSearchTerm)
              );
            })
            .map((article, index) => (
              <Post
                title={article.title}
                body={article.text}
                image={
                  article.image ? article.image : images[index % images.length]
                }
                key={article._id}
                id={article._id}
                comments={article.comments}
                curUsername={user ? user.username : googleLoginUserName}
                testId="article-post"
              />
            ))}
        </div>
        <div className="pagination-controls">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          <ul className="pagination">{renderPageNumbers()}</ul>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
