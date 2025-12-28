// src/context/CompilerContext.jsx
import React, { createContext, useContext, useState } from "react";

const CompilerContext = createContext();

export const useCompiler = () => useContext(CompilerContext);

export const CompilerProvider = ({ children }) => {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setError("");

    try {
    // TODO:
    
      const response = await fetch("http://localhost:5000/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      if (data.error) setError(data.error);
      else setOutput(data.output);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <CompilerContext.Provider
      value={{
        code,
        setCode,
        language,
        setLanguage,
        output,
        error,
        isRunning,
        runCode,
      }}
    >
      {children}
    </CompilerContext.Provider>
  );
};
