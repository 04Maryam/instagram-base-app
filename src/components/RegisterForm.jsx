//RegisterForm.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/AuthForm.css";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Signup successful!");

      setTimeout(() => {
        navigate("/authform");
      }, 2000); 
    } catch (err) {
      setError("Failed to register: " + err.message);
    }
  };

  return (
    <div className="auth-form-container">
      {message && <p className="message">{message}</p>}
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p>
        Already have an account?
        <Link to="/"> Login</Link>
      </p>
    </div>
  );
}
