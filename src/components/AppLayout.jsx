import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import NewsFeed from "./NewsFeed";
import AuthForm from "./AuthForm";
import RegisterForm from "./RegisterForm";
import PostPage from "./PostPage";
import ChatPage from "./ChatPage";
import Composer from "./Composer";

export default function AppLayout({ loggedInUser, handleLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const hideAuthButton = location.pathname === "/authform" || location.pathname === "/signup";

  const handleAuthButtonClick = () => {
    navigate("/authform");
  };

  return (
    <>
      <div className="app-header">
        {loggedInUser ? (
          <div className="user-header">
            <p>{loggedInUser.email.split("@")[0]}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          !hideAuthButton && (
            <div className="auth-button">
              <button onClick={handleAuthButtonClick}>
                Create Account or Sign In
              </button>
            </div>
          )
        )}
      </div>

      <nav>
        <Link to="/">Home</Link> <Link to="/chat">Chat</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<NewsFeed loggedInUser={loggedInUser} />} />
        <Route path="/composer" element={<Composer loggedInUser={loggedInUser} />}/>
        <Route path="/authform" element={<AuthForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/post/:postId" element={<PostPage loggedInUser={loggedInUser} />} />
      </Routes>
    </>
  );
}
