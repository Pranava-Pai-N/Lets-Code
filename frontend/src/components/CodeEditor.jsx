import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { LANGUAGE_BOILERPLATES } from "../constants/boilerplates.js";

const CodeEditor = ({ languages = [], code, setCode, setLanguageId, height = "400px" }) => {
  const [allLanguages, setAllLanguages] = useState([]);
  const [selectedLangObj, setSelectedLangObj] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [codeMap, setCodeMap] = useState({}); 

  const getBoilerplate = useCallback((judge0Name) => {
    const keys = Object.keys(LANGUAGE_BOILERPLATES);
    const match = keys
      .sort((a, b) => b.length - a.length)
      .find(key => judge0Name.toLowerCase().includes(key.toLowerCase()));
    
    return match ? LANGUAGE_BOILERPLATES[match] : "// Start coding...";
  }, []);

  useEffect(() => {
    const fetchAllLanguages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_JUDGE0_URL}/languages`);

        const judge0Data = res.data; 

        setAllLanguages(judge0Data);

        if (judge0Data.length > 0 && !selectedLangObj) {
          const firstLang = judge0Data[0];
          const initialBoilerplate = getBoilerplate(firstLang.name);
          
          setSelectedLangObj(firstLang);
          setLanguageId(firstLang.id);
          setCode(initialBoilerplate);
          setCodeMap({ [firstLang.id]: initialBoilerplate });
        }
      } catch (err) {
        console.error("Language fetch failed:", err);
      }
    };
    fetchAllLanguages();
  }, [setLanguageId, getBoilerplate]);

  const selectLanguage = (lang) => {
    const id = lang.id;
    const newCode = codeMap[id] || getBoilerplate(lang.name);

    setSelectedLangObj(lang);
    setLanguageId(id);
    setCode(newCode);
    
    setCodeMap(prev => ({ ...prev, [id]: newCode }));
    setDropdownOpen(false);
  };

  const handleCodeChange = (value) => {
    if (selectedLangObj) {
      setCodeMap(prev => ({ ...prev, [selectedLangObj.id]: value }));
      setCode(value);
    }
  };

  const getMonacoLang = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("c++")) return "cpp";
    if (lower.includes("c#")) return "csharp";
    if (lower.includes("python")) return "python";
    if (lower.includes("java")) return "java";
    if (lower.includes("javascript")) return "javascript";
    if (lower.includes("typescript")) return "typescript";
    return "plaintext";
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-xl bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Editor</span>
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedLangObj ? selectedLangObj.name : "Select Language"}
            <span className="text-[10px]">▼</span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 z-[100] rounded shadow-2xl border border-gray-200 dark:border-gray-700">
              {allLanguages.map((lang) => (
                <div 
                  key={lang.id}
                  className={`px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer text-sm border-b border-gray-50 dark:border-gray-700 last:border-none ${selectedLangObj?.id === lang.id ? 'bg-indigo-100 dark:bg-indigo-900' : ''}`}
                  onClick={() => selectLanguage(lang)}
                >
                  {lang.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          language={selectedLangObj ? getMonacoLang(selectedLangObj.name) : "plaintext"}
          value={codeMap[selectedLangObj?.id] || ""}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
            scrollBeyondLastLine: false
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;