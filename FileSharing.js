import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import './FileSharing.css'; // Assuming a separate CSS file for styles

const FileSharing = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      const filesCollection = collection(firestore, "files");
      const filesSnapshot = await getDocs(filesCollection);
      const filesList = filesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUploadedFiles(filesList);
    };

    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64File = reader.result;

        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedBy: auth.currentUser ? auth.currentUser.email : "Unknown User",
          fileContent: base64File, // Store the Base64 string
          timestamp: new Date(),
        };

        const docRef = await addDoc(collection(firestore, "files"), fileData);

        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          { id: docRef.id, ...fileData },
        ]);
        alert("File uploaded successfully!");
        setFile(null);
      };

      reader.readAsDataURL(file); // Convert file to Base64
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (fileContent, name) => {
    const link = document.createElement("a");
    link.href = fileContent;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h1>File Sharing</h1>
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button onClick={handleFileUpload} disabled={loading} className="upload-btn">
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </div>

      <h2>Uploaded Files</h2>
      <div className="file-list">
        {uploadedFiles.map((file) => (
          <div className="file-item" key={file.id}>
            <div className="file-info">
              <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
              <br />
              <span>Uploaded by: {file.uploadedBy}</span>
            </div>
            <button
              onClick={() => downloadFile(file.fileContent, file.name)}
              className="download-btn"
            >
              Open File
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileSharing;




