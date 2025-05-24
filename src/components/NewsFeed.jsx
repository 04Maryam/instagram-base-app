// components/NewsFeed.jsx
import { remove, onChildAdded, push, ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import Composer from "./Composer";
import "../styles/NewsFeed.css"; 

const DB_MESSAGES_KEY = "messages";

export default function NewsFeed({ loggedInUser }) {
  const [messages, setMessages] = useState([]);
  const [likes, setLikes] = useState({});

  const [hoveredPostId, setHoveredPostId] = useState(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((prevState) => {
        const exists = prevState.some((msg) => msg.key === data.key);
        if (!exists) {
          return [...prevState, { key: data.key, val: data.val() }];
        }
        return prevState;
      });
    });
  }, []);

  useEffect(() => {
    const likesRef = ref(database, "likes");
    return onValue(likesRef, (snapshot) => {
      setLikes(snapshot.val() || {});
    });
  }, []);

  const toggleLike = async (postId) => {
    const userLikeRef = ref(database, `likes/${postId}/${loggedInUser.uid}`);
    if (likes[postId] && likes[postId][loggedInUser.uid]) {
      await remove(userLikeRef);
    } else {
      await set(userLikeRef, true);
    }
  };

  const hasLiked = (postId) => (likes[postId]?.[loggedInUser.uid]);


  const groupedMessages = messages.reduce((acc, message) => {
    const dateObj = new Date(message.val.timestamp);
    const dateKey = dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(message);
    return acc;
  }, {});

  
  return (
    <>
      <div className="newsfeed-container">
        <h2 className="newsfeed-title">News Feed</h2>

        <div className="tooltip-container">
          <button
            onClick={() => navigate("/composer")}
            disabled={!loggedInUser}
            className={!loggedInUser ? "disabled-button" : "create-button"}
          >
            New Post
          </button>
          {!loggedInUser && (
            <span className="tooltip-text">
              <p>You need to login first to post</p>
              <div className="tooltip-buttons">
                <button
                  onClick={() => navigate("/signup")}
                  className="signup-button"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate("/authform")}
                  className="login-button"
                >
                  Login
                </button>
              </div>
            </span>
          )}
        </div>

        <div>
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="message-group">
              <h3 className="date-heading">{date}</h3>
              <ol className="message-list">
                {msgs.map((message) => (
                  <Link to={`/post/${message.key}`} key={message.key}>
                    <li className="message-item" key={message.key}>
                      <div className="author">
                        {message.val.author?.displayName ||
                          message.val.author?.email}
                      </div>
                      <div className="message-text">
                          {message.val.text}
                      </div>
                      {loggedInUser ? (
                        <div className="message-footer">
                          <div className="like-comment">
                            <span className="like-icon">
                              {/* <button
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent the default anchor link behavior
                                  e.stopPropagation(); // Prevent the event from bubbling up to <Link>
                                  toggleLike(message.key);
                                }}
                                className="like-button"
                              >
                                <i
                                  // className="bi bi-heart"
                                  className={`bi ${
                                    hasLiked(message.key)
                                      ? "bi-heart-fill like-button-clicked"
                                      : "bi-heart"
                                  }`}
                                  onMouseEnter={(e) =>
                                    e.currentTarget.classList.add(
                                      "bi-heart-fill",
                                      "like-button-clicked"
                                    )
                                  }
                                  onMouseLeave={(e) => {
                                    if (!hasLiked(message.key)) {
                                      e.currentTarget.classList.remove(
                                        "bi-heart-fill",
                                        "like-button-clicked"
                                      );
                                    }
                                  }}
                                ></i>

                                
                              </button> */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleLike(message.key);
                                }}
                                className="like-button"
                              >
                                <i
                                  className={`bi ${
                                    hasLiked(message.key) || hoveredPostId === message.key
                                      ? "bi-heart-fill like-button-clicked"
                                      : "bi-heart"
                                  }`}
                                  onMouseEnter={() => setHoveredPostId(message.key)}
                                  onMouseLeave={() => setHoveredPostId(null)}
                                ></i>
                              </button>

                            </span>
                            <span className="comment-icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/post/${message.key}?highlightComment=true`);}}>
                              {/* <Link
                                to={`/post/${message.key}?highlightComment=true`}
                              > */}
                                <i
                                  className="bi bi-chat"
                                  onMouseEnter={(e) =>
                                    e.target.classList.replace(
                                      "bi-chat",
                                      "bi-chat-fill"
                                    ) ||
                                    e.target.classList.add(
                                      "comment-button-clicked"
                                    )
                                  }
                                  onMouseLeave={(e) =>
                                    e.target.classList.replace(
                                      "bi-chat-fill",
                                      "bi-chat"
                                    ) ||
                                    e.target.classList.remove("comment-button")
                                  }
                                ></i>
                              {/* </Link> */}
                            </span>
                          </div>

                          <div className="timestamp">
                            {new Date(message.val.timestamp).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="timestamp">
                          {new Date(message.val.timestamp).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </div>
                      )}
                    </li>
                  </Link>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
