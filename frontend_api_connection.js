// 📁 File: .env
// Place this at the root of your Vite + React project
VITE_BACKEND_URL=https://ai-infi-pt-backend-1.onrender.com

// 📁 File: src/api/runTest.js
export const runTest = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/run-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: "AI_INFI_PT" })
    });

    if (!response.ok) throw new Error("Server Error");

    const result = await response.json();
    console.log("✅ Test Result:", result);
    return result;
  } catch (err) {
    console.error("❌ API Error:", err);
    throw err;
  }
};

// 📁 File: src/components/TestRunner.jsx
import React from 'react';
import { runTest } from '../api/runTest';

const TestRunner = () => {
  const handleClick = async () => {
    try {
      const result = await runTest();
      alert("Test completed successfully: " + JSON.stringify(result));
    } catch (error) {
      alert("Test failed: " + error.message);
    }
  };

  return (
    <div>
      <h2>AI INFI PT - Trigger Test</h2>
      <button onClick={handleClick}>Run Test</button>
    </div>
  );
};

export default TestRunner;

// 📁 File: src/App.jsx
import React from 'react';
import TestRunner from './components/TestRunner';

const App = () => {
  return (
    <div className="App">
      <h1>AI INFI PT</h1>
      <TestRunner />
    </div>
  );
};

export default App;
