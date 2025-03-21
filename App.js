import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Whiteboard from "./components/Whiteboard";
import CalendarPage from "./components/CalendarPage";
import FileSharing from "./components/FileSharing";
import VideoCall from "./components/VideoCall";
import TimeTracker from "./components/TimeTracker";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Whiteboard" element={<Whiteboard/>}/>
        <Route path="/FileSharing" element={<FileSharing />} />
        <Route path="/CalendarPage" element={<CalendarPage />} />
        <Route path="VideoCall" element={<VideoCall/>}/>
        <Route path="TimeTracker" element={<TimeTracker/>}/>
       
      
        
        

        
      </Routes>
    </Router>
  );
};

export default App;






