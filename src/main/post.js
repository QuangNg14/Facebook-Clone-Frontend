import React, { useState } from "react";
import "./post.css";

function Post(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  const [image, setImage] = useState(props.image);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSaveClick = () => {
    // props.onSave(title, body, image);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setTitle(props.title);
    setBody(props.body);
    setImage(props.image);
    setIsEditing(false);
  };

  const handleCommentClick = () => {
    // props.onComment();
  };

  if (isEditing) {
    return (
      <div data-testid={props.testId}>
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
      <button onClick={handleCommentClick}>Comment</button>
      <button onClick={handleEditClick}>Edit</button>
    </div>
  );
}

export default Post;
