// components/CommentForm.jsx
import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database } from "../firebase";
import "../styles/CommentForm.css";

// const DB_COMMENTS_KEY = "comments";

export default function CommentForm({ postId, user, onCommentAdded, inputRef }) {
  const [comment, setComment] = useState("");

  // console.log("CommentForm user:", user);
  // console.log("CommentForm postId:", postId);
  // console.log("CommentForm comment:", comment);
  // console.log("CommentForm onCommentAdded:", onCommentAdded);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || comment.trim() === "") return;

    const commentsRef = ref(database, `comments/${postId}`);
    const newCommentRef = push(commentsRef);

    const commentData = {
      text: comment,
      timestamp: new Date().toISOString(),
      author: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split("@")[0],
      },
    };

    await set(newCommentRef, commentData).then(() => {
      setComment("");
      // onCommentAdded();
    });
  };


  return (
    <div className="comment-form-container">
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          ref={inputRef}
          className="comment-input"
        />
        <button type="submit" className="post-comment">Send</button>
      </form>
    </div>
  );
}
