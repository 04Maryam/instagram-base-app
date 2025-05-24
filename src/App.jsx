import "./App.css";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import {BrowserRouter as Router} from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import AppLayout from "./components/AppLayout";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  // const [shouldRenderAuthForm, setShouldRenderAuthForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoggedInUser(currentUser);
      console.log("Auth state changed. User:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  // const toggleAuthForm = () => {
  //   setShouldRenderAuthForm((prev) => !prev);
  // };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <Router>
      <AppLayout
        loggedInUser={loggedInUser}
        handleLogout={handleLogout}
      />
    </Router>
  );
}
