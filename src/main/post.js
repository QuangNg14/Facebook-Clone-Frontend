import React, { useState } from "react";
import "./post.css";

function Post(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  const [image, setImage] = useState(props.image);
  const [isEditing, setIsEditing] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(props.comments || []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCommentClick = async () => {
    try {
      const commentData = {
        comment: {
          text: newComment,
          commenter: props.curUsername,
        },
        commentId: -1,
      };

      const response = await fetch(
        `https://ricecomp431app-5b7591b01f3b.herokuapp.com/articles/${props.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(commentData),
        }
      );

      if (!response.ok) {
        throw new Error("Error submitting comment");
      }

      const updatedArticle = await response.json();
      setCommentList(updatedArticle.articles[0].comments);
      setNewComment("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const articleId = props.id;
      const articleData = {
        title: title,
        text: body,
        image: image,
      };

      const response = await fetch(
        `https://ricecomp431app-5b7591b01f3b.herokuapp.com/articles/${articleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(articleData),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating article");
      }

      const responseData = await response.json();
      console.log("Article updated:", responseData);

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const handleCancelClick = () => {
    setTitle(props.title);
    setBody(props.body);
    setImage(props.image);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="post" data-testid={props.testId}>
        <h2>Title: {title}</h2>
        <p>Body: {body}</p>
        <img src={image} alt="post" data-testid={`${props.testId}-image`} />
        <input type="text" value={title} onChange={handleTitleChange} />
        <textarea value={body} onChange={handleBodyChange} />
        <input type="text" value={image} onChange={handleImageChange} />
        <button onClick={handleSaveClick}>Save</button>
        <button onClick={handleCancelClick}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="post" data-testid={`${props.testId}-container`}>
      <h2>Title: {title}</h2>
      <p>Body: {body}</p>
      <img src={image} alt="post" data-testid={`${props.testId}-image`} />
      {/* <button onClick={handleCommentClick}>Comment</button> */}
      <button onClick={handleEditClick}>Edit</button>
      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleCommentClick}>Submit Comment</button>
      </div>
      <h5>List comments</h5>
      <div className="comments-section">
        {commentList &&
          commentList.map((comment, index) => (
            <div key={index} className="comment">
              <strong>{comment.commenter}</strong>: {comment.text}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Post;
