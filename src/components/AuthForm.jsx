// components/AuthForm.jsx
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase"; 
import "../styles/AuthForm.css";


export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError(null);

    try {
      
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful");
      
      setTimeout(() => {
        navigate("/");
      }
      , 2000); 
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <>
      <div className="auth-form-container">
        {message && <p className="message">{message}</p>}
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p>
          Don't have an account?
          <Link to="/signup"> Register</Link>
        </p>
      </div>
    </>
  );
}
