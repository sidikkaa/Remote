import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { firestore } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", status: "" });

  useEffect(() => {
    const eventsCollection = collection(firestore, "calendarEvents");

    // Real-time listener for calendar events
    const unsubscribe = onSnapshot(eventsCollection, (snapshot) => {
      const eventsList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          start: new Date(data.start.seconds * 1000),
          end: new Date(data.end.seconds * 1000),
          status: data.status || "To-Do",
        };
      });
      setEvents(eventsList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.status) {
      alert("Please fill out all fields.");
      return;
    }

    const eventToAdd = {
      title: newEvent.title,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
      status: newEvent.status,
    };

    try {
      await addDoc(collection(firestore, "calendarEvents"), eventToAdd);
      setNewEvent({ title: "", start: "", end: "", status: "" });
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Calendar</h1>
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newEvent.start}
          onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newEvent.end}
          onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
        />
        <select
          value={newEvent.status}
          onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
        >
          <option value="">Select Status</option>
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button onClick={handleAddEvent}>Add Event</button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "500px" }}
        eventPropGetter={(event) => {
          let backgroundColor;
          if (event.status === "To-Do") backgroundColor = "lightcoral";
          if (event.status === "In Progress") backgroundColor = "lightblue";
          if (event.status === "Done") backgroundColor = "lightgreen";
          return { style: { backgroundColor } };
        }}
      />
    </div>
  );
};

export default CalendarPage;





