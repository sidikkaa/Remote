import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

const TimeTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [hours, setHours] = useState("");
  const [user, setUser] = useState("");
  const [logEntries, setLogEntries] = useState([]);

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(firestore, "tasks");
      const tasksSnapshot = await getDocs(tasksCollection);
      const tasksList = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    };

    fetchTasks();
    fetchLogEntries();
  }, []);

  // Fetch log entries from Firestore
  const fetchLogEntries = async () => {
    const logCollection = collection(firestore, "timeLogs");
    const logSnapshot = await getDocs(logCollection);
    const logs = logSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLogEntries(logs);
  };

  // Handle adding a time log
  const handleAddLog = async () => {
    if (!selectedTask || !hours || !user) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const newLog = {
      taskId: selectedTask,
      hours: Number(hours),
      user,
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(firestore, "timeLogs"), newLog);
      setHours("");
      setUser("");
      setSelectedTask("");
      fetchLogEntries(); // Refresh logs after adding
    } catch (error) {
      console.error("Error logging time: ", error);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", margin: "20px 0" }}>
      <h2 style={{ textAlign: "center" }}>Time Tracking</h2>

      {/* Time Logging Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Select Task</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Your Name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Hours Worked"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleAddLog}
          style={{
            backgroundColor: "#2575fc",
            color: "#fff",
            padding: "10px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Log Time
        </button>
      </div>

      {/* Display Logged Entries */}
      <h3 style={{ marginTop: "20px" }}>Logged Hours</h3>
      <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
        {logEntries.length > 0 ? (
          logEntries.map((log) => (
            <div key={log.id} style={{ marginBottom: "10px", padding: "10px", backgroundColor: "#fff", borderRadius: "4px" }}>
              <p>
                <strong>Task:</strong> {tasks.find((t) => t.id === log.taskId)?.name || "Unknown"}
              </p>
              <p>
                <strong>User:</strong> {log.user}
              </p>
              <p>
                <strong>Hours:</strong> {log.hours}
              </p>
            </div>
          ))
        ) : (
          <p>No logs found.</p>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;

