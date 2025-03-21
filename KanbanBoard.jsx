import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { collection, onSnapshot, setDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase";

const KanbanBoard = () => {
  // Initial column definitions
  const initialColumns = {
    todo: {
      title: "To Do",
      color: "red",
      items: [],
    },
    inProgress: {
      title: "In Progress",
      color: "blue",
      items: [],
    },
    done: {
      title: "Done",
      color: "green",
      items: [],
    },
  };

  const [columns, setColumns] = useState(initialColumns);

  // Function to filter tasks by the current month
  const filterTasksByCurrentMonth = (tasks) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return tasks.filter((task) => {
      if (!task.start || !task.start.seconds) return false; // Ensure valid task date
      const taskDate = new Date(task.start.seconds * 1000); // Convert Firestore Timestamp to JS Date
      return (
        taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear
      );
    });
  };

  // Firestore real-time listener
  useEffect(() => {
    const tasksCollection = collection(firestore, "calendarEvents");

    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      console.log("Snapshot received:", snapshot.docs);

      // Map Firestore documents to task objects
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "Untitled Task",
        start: doc.data().start, // Firestore Timestamp
        status: doc.data().status || "todo", // Default to "todo" if status is missing
      }));

      // Filter tasks for the current month
      const currentMonthTasks = filterTasksByCurrentMonth(tasks);
      console.log("Filtered tasks for the current month:", currentMonthTasks);

      // Organize tasks into columns based on their status
      const updatedColumns = {
        todo: { ...initialColumns.todo, items: [] },
        inProgress: { ...initialColumns.inProgress, items: [] },
        done: { ...initialColumns.done, items: [] },
      };

      currentMonthTasks.forEach((task) => {
        if (updatedColumns[task.status]) {
          updatedColumns[task.status].items.push(task);
        } else {
          updatedColumns.todo.items.push(task); // Default to "To Do" column
        }
      });

      console.log("Updated columns:", updatedColumns);
      setColumns(updatedColumns); // Update Kanban board state
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Handle drag-and-drop functionality
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // If dropped outside a valid area, do nothing
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.status = destination.droppableId; // Update task's status
    destItems.splice(destination.index, 0, movedItem);

    // Update the Kanban board UI
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
      [destination.droppableId]: { ...destColumn, items: destItems },
    });

    // Update the task's status in Firestore
    try {
      await setDoc(doc(firestore, "calendarEvents", movedItem.id), movedItem);
      console.log("Task updated in Firestore:", movedItem);
    } catch (error) {
      console.error("Error updating task in Firestore:", error);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} style={{ width: "300px" }}>
            <h3 style={{ textAlign: "center", color: column.color }}>{column.title}</h3>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: "#f8f8f8",
                    padding: "10px",
                    borderRadius: "8px",
                    minHeight: "500px",
                    maxHeight: "600px",
                    overflowY: "scroll",
                    border: `2px solid ${column.color}`,
                  }}
                >
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          style={{
                            ...provided.draggableProps.style,
                            background: "#fff",
                            borderRadius: "5px",
                            padding: "10px",
                            marginBottom: "10px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            borderLeft: `5px solid ${column.color}`,
                          }}
                        >
                          <h4>{item.title}</h4>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;

















