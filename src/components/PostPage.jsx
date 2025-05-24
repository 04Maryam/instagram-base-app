// components/PostPage.jsx
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ref, get, onValue, set, remove } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState, useRef } from "react";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import "../styles/PostPage.css"; 

export default function PostPage({ loggedInUser }) {
  const { postId } = useParams();
  const [post, setPost] = useState("");
  const [likes, setLikes] = useState({});
  const [hovered, setHovered] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const commentInputRef = useRef(null);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const shouldHighlight = params.get("highlightComment") === "true";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = ref(database, `messages/${postId}`);

      get(postRef).then((snapshot) => {
        if (snapshot.exists()) {
          setPost(snapshot.val());
        }
      });
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const likesRef = ref(database, `likes/${postId}`);
    const unsubscribe = onValue(likesRef, (snapshot) => {
      setLikes(snapshot.val() || {});
    });
    return () => unsubscribe();
  }, [postId]);

  // Check if loggedInUser liked this post
  const hasLiked = () => {
    return loggedInUser && likes[loggedInUser.uid];
  };

  // Toggle like/unlike
  const toggleLike = async () => {
    if (!loggedInUser) return; // optionally, show alert or redirect to login
    const userLikeRef = ref(database, `likes/${postId}/${loggedInUser.uid}`);

    if (hasLiked()) {
      await remove(userLikeRef);
    } else {
      await set(userLikeRef, true);
    }
  };

  useEffect(() => {
    if (shouldHighlight && commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        commentInputRef.current.focus();
      }, 100);
    }
  }, [shouldHighlight]);

  const handleCommentIconClick = () => {
    if (commentInputRef.current) {
      commentInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      commentInputRef.current.focus();
    }
  };

  return (
    <>
      <div className="post-page">
        <div className="back-button-container">
          <button onClick={() => navigate("/")} className="back-button">Back</button>
        </div>
        <h2>Post Info</h2>
        {post ? (
          <>
            {/* <div className="post-header"> */}
            <p className="author">
              {post.author?.displayName || post.author?.email}
            </p>

            {/* </div> */}
            <p>{post.text}</p>

            <div className="post-footer">
              <div className="post-actions">
                <span className="like-icon">
                  <button
                    onClick={toggleLike}
                    className="like-button"
                    // disabled={!loggedInUser}
                  >
                    <i
                      className={`bi ${
                        hasLiked() || hovered
                          ? "bi-heart-fill like-button-clicked"
                          : "bi-heart"
                      }`}
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                    ></i>
                  </button>
                </span>
                <span className="comment-icon"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation();
                    handleCommentIconClick();
                  }}
                >
                  {/* <Link> */}
                    <i
                      className="bi bi-chat"
                      onMouseEnter={(e) =>
                        e.target.classList.replace("bi-chat", "bi-chat-fill") ||
                        e.target.classList.add("comment-button-clicked")
                      }
                      onMouseLeave={(e) =>
                        e.target.classList.replace("bi-chat-fill", "bi-chat")
                      }
                    ></i>
                  {/* </Link> */}
                </span>
              </div>
              <p className="timestamp">
                {new Date(post.timestamp).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Comments
        postId={postId}
        user={loggedInUser}
        onCommentAdded={() => setRefresh(!refresh)}
      />
      <CommentForm
        postId={postId}
        user={loggedInUser}
        inputRef={commentInputRef}
      />
    </>
  );
}
