// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import app, { firestore } from "../firebase"; // Ensure firebase.js is properly set up

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleLogin = async () => {
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user information to Firestore
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        uid: user.uid,
      });

      alert("Authentication successful!");
      navigate("/home");
    } catch (error) {
      setError(error.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #74ebd5, #acb6e5)", // Updated gradient colors
        color: "#fff",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "30px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Softer shadow for better aesthetics
          color: "#333",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#007bff" }}>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            margin: "12px 0",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxSizing: "border-box",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            margin: "12px 0",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxSizing: "border-box",
          }}
        />
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Login
        </button>
        <div style={{ marginTop: "15px" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>
            Don’t have an account? <a href="/register" style={{ color: "#007bff" }}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


