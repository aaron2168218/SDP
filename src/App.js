import React, { useState } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [calculationResult, setCalculationResult] = useState('');

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setFiles(prevFiles => [...prevFiles, { name: file.name, content: text }]);
        setSelectedFileContent(text); // Auto-select the uploaded file for simplicity
      };
      reader.readAsText(file);
    });
    e.target.value = ''; // Clear the file input
  };

  const removeFile = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const calculateComplexity = () => {
    // Simplified analysis based on the content of the selected file
    const lines = selectedFileContent.split('\n');
    const nodes = selectedFileContent.match(/function/g)?.length || 0; 
    const edges = lines.length - 1; // Subtract one to account for the last line break

    const connectedComponents = 1; // Assuming a single connected component
    const complexity = edges - nodes + (2 * connectedComponents);

    setCalculationResult(`Nodes: ${nodes}, Edges: ${edges}, Cyclomatic Complexity: ${complexity}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mortal Combat</h1>
      </header>
      <div className="main">
        <div className="card-left">
          <h2>Upload File</h2>
          <input type="file" multiple onChange={handleFileUpload} />
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-info">
                <span onClick={() => setSelectedFileContent(file.content)}>{file.name}</span>
                <button onClick={() => removeFile(file.name)}>X</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card-middle">
          <button onClick={calculateComplexity}>Calculate</button>
        </div>
        <div className="card-right">
          <h2>Calculation Result</h2>
          <p>{calculationResult || "Select a file and click 'Calculate' to see the result"}</p>
        </div>
      </div>
      <div className="file-content">
        <pre>{selectedFileContent}</pre>
      </div>
    </div>
  );
}

export default App;
