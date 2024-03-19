import React, { useState } from 'react';
import './App.css';
import { parse } from 'acorn';
import { Bar } from 'react-chartjs-2'; // Correctly import the Bar component
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary parts from chart.js

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [complexity, setComplexity] = useState(0); 

  const getBackgroundColor = (complexity) => {
    if (complexity <= 4) {
      return 'rgba(75, 192, 192, 0.2)'; // Green for complexity 4 or under
    } else if (complexity <= 8) {
      return 'rgba(255, 206, 86, 0.2)'; // Yellow for complexity between 4 and 8
    } else {
      return 'rgba(255, 99, 132, 0.2)'; // Red for complexity above 8
    }
  };


  const chartData = {
    labels: ['Cyclomatic Complexity'],
    datasets: [
      {
        label: 'Cyclomatic Complexity',
        data: [complexity], // Use the complexity state here
        backgroundColor: [getBackgroundColor(complexity)],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      }
    ],
  };


  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 15, // Adjust as needed
      }
    },
    plugins: {
      legend: {
        display: true // Set to false to hide the legend
      }
    }
  };



  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setFiles(prevFiles => [...prevFiles, { name: file.name, content: text }]);
      };
      reader.readAsText(file);
    });
  };

  const removeFile = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const calculateComplexity = () => {
    if (!selectedFileContent) {
      alert('No file selected');
      return;
    }
  
    let nodeCount = 1; // Initialize node count
    let edgeCount = 1; // Initialize edge count
  
    // Split the content by new lines and analyze each line
    const lines = selectedFileContent.split('\n');
    lines.forEach((line) => {
      // Expanding the search to include more JavaScript control structures and elements as nodes
      const nodeMatches = line.match(/\b(function|if|else|for|while|switch|class|case|default|try|catch|finally|=>)\b/g);

      // edges count
      if(line.match(/\b(class)\b/g)){edgeCount = 1 + edgeCount};
      if(line.match(/\b(function)\b/g)){edgeCount = 1 + edgeCount};
      if(line.match(/\b(else)\b/g)){edgeCount = 1 + edgeCount};
      if(line.match(/\b(case)\b/g)){edgeCount = 1 + edgeCount};
      if(line.match(/\b(do)\b/g)){edgeCount = 1 + edgeCount};
      if(line.match(/\b(until)\b/g)){edgeCount = 1 + edgeCount};
      if(line.match(/\b(try)\b/g)){edgeCount = 1 + edgeCount};
      if(line.match(/\b(catch)\b/g)){edgeCount = 1 + edgeCount};
      if(line.match(/\b(if)\b/g)){edgeCount = 2 + edgeCount};
      if(line.match(/\b(while)\b/g)){edgeCount = 2 + edgeCount};
      if(line.match(/\b(for)\b/g)){edgeCount = 2 + edgeCount};
      if(line.match(/\b(switch)\b/g)){edgeCount = 2 + edgeCount};

      //const nodeMatches = line.match(/\b(function)\b/g);
      if (nodeMatches) {
        nodeCount += nodeMatches.length;
      }
  
      // Including 'if', 'for', 'while', 'switch', 'case', 'catch', 'finally' statements as edges
      // These control structures can potentially branch the flow
      // const edgeMatches = line.match(/\b(if|for|while|switch|case|catch|finally)\b/g);

    });
  
    // Assuming P = 1 for cyclomatic complexity calculation
    // Adjusting CC calculation: CC = E - N + 2 * P
    // Given the potential for 'case' statements to increase complexity, each 'case' is considered an edge
    const cyclomaticComplexity = edgeCount - nodeCount + 2 * 1; // Simplified formula with P=1
    setComplexity(cyclomaticComplexity);
  
    const resultText = `The file contains approximately ${nodeCount} nodes and ${edgeCount} edges. Cyclomatic Complexity: ${cyclomaticComplexity}`;
    setAnalysisResult(resultText);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cyclomatic Complexity Analyser</h1>
      </header>
      <div className="main">
        <div className="card-left">
          <h2>Upload File</h2>
          <input type="file" multiple onChange={handleFileUpload} accept=".py,.js" />
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-info">
                <span onClick={() => { setSelectedFileContent(file.content); }}>{file.name}</span>
                <button onClick={() => removeFile(file.name)}>X</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card-middle">
          <button onClick={calculateComplexity}>Analyse Complexity</button>
        </div>
        <div className="card-right">
          <h2>Analysis Result</h2>
          <p>{analysisResult || "Select a file and click 'Analyze Complexity' to see the results."}</p>
        </div>
      </div>
      <div className="file-content">
        <pre>{selectedFileContent}</pre>
      </div>
      
      <div className="chart-container" style={{ width: '400px', height: '300px', marginTop: '20px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default App;
