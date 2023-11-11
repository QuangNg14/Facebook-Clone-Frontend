// main.js
import React, { useState, useEffect, useContext } from "react";
import Post from "./post";
import "./main.css";
import UserProfile from "./user";
import { UserContext } from "../context/userContext";
import NavigateComponent from "./navigate";

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
  const [newArticleImage, setNewArticleImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [followedUsers, setFollowedUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newUserId, setNewUserId] = useState("");
  const userName = JSON.parse(localStorage.getItem("loginUser")).username || "";
  const [
    user,
    setUser,
    registeredUsers,
    setRegisteredUsers,
    loginState,
    setLoginState,
  ] = useContext(UserContext);

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("loginUser");
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage));
    }
  }, [setUser]);

  useEffect(() => {
    async function fetchUser() {
      const userResponse = await fetch(
        "https://jsonplaceholder.typicode.com/users?username=" + userName
      );
      const user = (await userResponse.json())[0];
      setUser(user);
    }
    fetchUser();
  }, [setUser, userName]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await response?.json();
        const user = JSON.parse(localStorage.getItem("loginUser"));
        const userId = user ? user.id : null;

        const followedUserIds = userId ? [userId] : [];

        if (followedUsers) {
          followedUsers.forEach((followedUser) => {
            followedUserIds.push(followedUser.id);
          });
        }
        setArticles(
          data.filter((post) => followedUserIds.includes(post.userId))
        );
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };
    fetchPosts();
  }, [followedUsers, user]);

  const handlePostArticle = () => {
    const newArticle = {
      userId: user.id,
      id: articles.length + 2,
      title: "New Article",
      body: newArticleContent,
      image: newArticleImage,
    };
    setArticles([newArticle].concat(articles));
    setNewArticleContent("");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFileChange = (event) => {
    setNewArticleImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleFollow = async () => {
    console.log(newUserId);
    if (
      newUserId >= 1 &&
      newUserId <= 10 &&
      !followedUsers.some((user) => user.id === newUserId)
    ) {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${newUserId}`
        );
        const newData = await response?.json();
        console.log("Follow user data: ", newData);
        setFollowedUsers((prevUsers) => [...prevUsers, newData]);
        setNewUserId("");
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    }
  };

  const handleUnfollow = (id) => {
    setFollowedUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
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
        />
        <div className="sidebar">
          <input
            type="text"
            placeholder="Add"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            data-testid="follow-user"
          />
          <button onClick={handleFollow} data-testid="follow-user-button">
            Follow
          </button>
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
          <textarea
            value={newArticleContent}
            onChange={(e) => setNewArticleContent(e.target.value)}
            style={{ width: "60%", height: 200 }}
          />
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
          <button className="button" onClick={() => setNewArticleContent("")}>
            Cancel
          </button>
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
          {articles
            .filter((article) => {
              const normalizedSearchTerm = searchTerm
                .toLowerCase()
                .replace(/\s+/g, "");
              const normalizedTitle = article.title
                .toLowerCase()
                .replace(/\s+/g, "");
              const normalizedBody = article.body
                .toLowerCase()
                .replace(/\s+/g, "");

              return (
                normalizedTitle.includes(normalizedSearchTerm) ||
                normalizedBody.includes(normalizedSearchTerm)
              );
            })
            .map((article, index) => (
              <Post
                title={article.title}
                body={article.body}
                image={images[index % images.length]}
                key={article.id}
                testId="article-post"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
