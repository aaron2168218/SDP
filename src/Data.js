// Data.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

function Data() {
  // Setting a static number for complexity to check the chart appearance
  const complexity = 7; // Static complexity value for demonstration

  const data = {
    labels: ['Cyclomatic Complexity'],
    datasets: [
      {
        label: 'Cyclomatic Complexity',
        data: [complexity], // Use the static complexity value here
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 15, // Set max value for y-axis
      },
      x: {
        display: false, // Hide x-axis labels
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
  };

  return (
    <div>
      <h1>Data Screen</h1>
      <Bar data={data} options={options} />
    </div>
  );
}

export default Data;
