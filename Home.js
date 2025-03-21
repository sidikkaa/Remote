import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "./KanbanBoard";
import ChatWindow from "./ChatWindow";
import TimeTracker from "./TimeTracker";
import {
  FaUsers,
  FaSignOutAlt,
  FaComment,
  FaVideo,
  FaFileAlt,
  FaCalendar,
  FaChalkboard,
  FaBell,
  FaClock,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(
    auth.currentUser ? auth.currentUser.email : "Guest"
  );
  const [users, setUsers] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const goToWhiteboard = () => {
    navigate("/whiteboard");
  };

  const goToFileSharing = () => {
    navigate("/FileSharing");
  };

  const goToCalendar = () => {
    navigate("/CalendarPage");
  };

  const goToVideoCall = () => {
    navigate("/VideoCall");
  };
  const goToTimeTracker=()=>{
    navigate("/TimeTracker")
  }

  const toggleChatWindow = () => {
    setChatVisible(!chatVisible);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Notification Bell Icon on Top Left */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          backgroundColor: "#f5f5f5",
          borderRadius: "50%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
        onClick={() => alert("Notification Bell Clicked")}
      >
        <FaBell size={24} color="#2575fc" />
      </div>

      {/* Header with text and user/logout icons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            margin: "0 auto",
          }}
        >
          Welcome to Remote Collaboration Suite
        </h1>
        <div
          style={{
            display: "flex",
            gap: "15px",
            position: "relative",
          }}
        >
          {/* People Icon */}
          <div
            onClick={toggleDropdown}
            style={{
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <FaUsers size={24} />
            </div>
          </div>

          {/* Logout Icon */}
          <div
            onClick={handleLogout}
            style={{
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <FaSignOutAlt size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown with users */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: dropdownVisible ? "60px" : "-200px",
            right: "50px",
            backgroundColor: "#fff",
            color: "#000",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            width: "200px",
            zIndex: 1000,
            transition: "top 0.3s ease",
            visibility: dropdownVisible ? "visible" : "hidden",
          }}
        >
          <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
            {users.length > 0 ? (
              users.map((user, index) => (
                <li
                  key={index}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    fontSize: "14px",
                    cursor: "default",
                  }}
                >
                  {user.email.slice(0, 4)}
                </li>
              ))
            ) : (
              <li style={{ padding: "8px", fontSize: "14px" }}>
                No users found
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Feature Circle Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div onClick={toggleChatWindow} style={{ cursor: "pointer" }}>
          <FaComment size={50} color="#2575fc" />
          <p>Chat</p>
        </div>
        <div onClick={goToVideoCall} style={{ cursor: "pointer" }}>
          <FaVideo size={50} color="#2575fc" />
          <p>Video Call</p>
        </div>
        <div onClick={goToFileSharing} style={{ cursor: "pointer" }}>
          <FaFileAlt size={50} color="#2575fc" />
          <p>File Sharing</p>
        </div>
        <div onClick={goToTimeTracker} style={{ cursor: "pointer" }}>
          <FaClock size={50} color="#2575fc" />
          <p>Time Tracker</p>
        </div>
        <div onClick={goToCalendar} style={{ cursor: "pointer" }}>
          <FaCalendar size={50} color="#2575fc" />
          <p>Calendar</p>
        </div>
        <div onClick={goToWhiteboard} style={{ cursor: "pointer" }}>
          <FaChalkboard size={50} color="#2575fc" />
          <p>Whiteboard</p>
        </div>
      </div>

      {/* Chat Window */}
      {chatVisible && <ChatWindow />}

      {/* Display the KanbanBoard component */}
      <KanbanBoard />
    </div>
  );
};

export default Home;


























