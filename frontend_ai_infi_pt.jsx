// frontend/src/App.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Bot } from "lucide-react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [file, setFile] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRunTest = async () => {
    if (!file) return alert("Please upload a test scenario JSON file");
    const formData = new FormData();
    formData.append("testFile", file);
    formData.append("aiEnabled", aiEnabled);

    const res = await fetch("/api/run-test", {
      method: "POST",
      body: formData,
    });
    const blob = await res.blob();
    setReportUrl(URL.createObjectURL(blob));
  };

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen p-6" : "bg-white text-black min-h-screen p-6"}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">AI INFI PT</h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <Sun className="w-4 h-4" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Moon className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1">
            <Bot className="w-4 h-4" />
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>
        </div>
      </div>

      <Card className="p-4">
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input type="file" accept=".json" onChange={handleFileUpload} />
            <Button onClick={handleRunTest}>Run Test</Button>
            {reportUrl && (
              <a
                href={reportUrl}
                download="Test_Report.pdf"
                className="text-blue-500 underline mt-4"
              >
                Download PDF Report
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
