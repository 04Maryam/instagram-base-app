// components/Comments.jsx
import { useEffect, useState } from "react";
import { ref, onChildAdded, onValue } from "firebase/database";
import { database } from "../firebase";
import "../styles/Comments.css";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
      const commentsRef = ref(database, `comments/${postId}`);
      onChildAdded(commentsRef, (data) => {
        setComments((prevState) => {
          const exists = prevState.some((com) => com.key === data.key);
          if (!exists) {
            return [...prevState, { key: data.key, val: data.val() }];
          }
          return prevState;
        });
      });
    }, []);


  
  return (
    <div className="comments-section">
      {/* <h4>Comments</h4> */}
      
      {comments.length === 0 ? (
        <div className="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.key} className="comment">
            <span className="author">
              {comment.val.author?.displayName || comment.val.author?.email}
            </span>
            <span className="text">{comment.val.text}</span>
          </div>
        ))
      )}
    </div>
  );
}
