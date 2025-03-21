import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../firebase";
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faUndo, faRedo } from "@fortawesome/free-solid-svg-icons";

const Whiteboard = ({ userUid }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // "pen", "eraser"
  const [lines, setLines] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [whiteboardId] = useState("mainWhiteboard");

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    const docRef = doc(firestore, "whiteboards", whiteboardId);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const storedLines = docSnap.data().lines || [];
        setLines(storedLines);
        drawLines(ctx, storedLines);
      } else {
        setDoc(docRef, { lines: [] });
      }
    });
  }, [whiteboardId]);

  const drawLines = (ctx, lines) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
    lines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);
      line.points.forEach((point) => {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      });
    });
  };

  const startDrawing = (e) => {
    setDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;

    const newLine = { startX: offsetX, startY: offsetY, points: [] };
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    setLines([...lines, newLine]);
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;

    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = 5;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    const newLines = [...lines];
    const currentLine = newLines[newLines.length - 1];
    currentLine.points.push({ x: offsetX, y: offsetY });

    setLines(newLines);
  };

  const stopDrawing = () => {
    setDrawing(false);
    updateWhiteboard(lines);
  };

  const updateWhiteboard = (() => {
    let timeout = null;
    return (newLines) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const docRef = doc(firestore, "whiteboards", whiteboardId);
        await updateDoc(docRef, { lines: newLines });
      }, 5); // Update every 500ms
    };
  })();

  const undo = () => {
    if (lines.length === 0) return;

    const newUndoStack = [...undoStack, lines[lines.length - 1]];
    const newLines = lines.slice(0, -1);

    setUndoStack(newUndoStack);
    setRedoStack([]);
    setLines(newLines);
    updateWhiteboard(newLines);
  };

  const redo = () => {
    if (undoStack.length === 0) return;

    const lastUndo = undoStack.pop();
    const newLines = [...lines, lastUndo];

    setUndoStack([...undoStack]);
    setRedoStack([]);
    setLines(newLines);
    updateWhiteboard(newLines);
  };

  const clearBoard = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setLines([]);
    setUndoStack([]);
    setRedoStack([]);
    await updateWhiteboard([]);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        style={{
          border: "1px solid #000",
          cursor: "crosshair",
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <button
          style={{ fontWeight: "bold", margin: "0 5px" }}
          onClick={() => setTool("pen")}
        >
          <FontAwesomeIcon icon={faPencilAlt} /> Pencil
        </button>
        <button
          style={{ margin: "0 5px" }}
          onClick={undo}
        >
          <FontAwesomeIcon icon={faUndo} /> Undo
        </button>
        <button
          style={{ margin: "0 5px" }}
          onClick={redo}
        >
          <FontAwesomeIcon icon={faRedo} /> Redo
        </button>
        <button
          style={{ margin: "0 5px" }}
          onClick={clearBoard}
        >
          Clear Board
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;



