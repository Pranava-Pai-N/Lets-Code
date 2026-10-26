import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { LANGUAGE_BOILERPLATES } from "../constants/boilerplates.js";

const getBoilerplate = (judge0Name) => {
  const keys = Object.keys(LANGUAGE_BOILERPLATES);
  const match = keys
    .sort((a, b) => b.length - a.length)
    .find((key) => judge0Name.toLowerCase().includes(key.toLowerCase()));
  return match ? LANGUAGE_BOILERPLATES[match] : "// Start coding...";
};

const getMonacoLanguage = (name) => {
  const lower = (name || "").toLowerCase();
  if (lower.includes("c++")) return "cpp";
  if (lower.includes("c#")) return "csharp";
  if (lower.includes("python")) return "python";
  if (lower.includes("java")) return "java";
  if (lower.includes("javascript")) return "javascript";
  if (lower.includes("typescript")) return "typescript";
  if (lower.includes("go")) return "go";
  if (lower.includes("rust")) return "rust";
  return "plaintext";
};

export function useLanguageManager(initialCode) {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [codeMap, setCodeMap] = useState({});
  const [code, setCode] = useState(initialCode ?? "// Write your solution here");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_JUDGE0_URL}/languages`);
        if (!active) return;
        const data = res.data ?? [];
        setLanguages(data);
        if (data.length > 0 && !selectedLanguage) {
          const first = data[0];
          const bp = getBoilerplate(first.name);
          setSelectedLanguage(first);
          setCode(bp);
          setCodeMap({ [first.id]: bp });
        }
      } catch (err) {
        console.error("Language fetch failed:", err);
        if (active) setError("Failed to load languages");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchAll();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectLanguage = useCallback(
    (lang) => {
      const id = lang.id;
      const newCode = codeMap[id] ?? getBoilerplate(lang.name);
      setSelectedLanguage(lang);
      setCode(newCode);
      setCodeMap((prev) => ({ ...prev, [id]: newCode }));
    },
    [codeMap],
  );

  const setCodeForSelected = useCallback(
    (value) => {
      setCode(value);
      if (selectedLanguage) {
        setCodeMap((prev) => ({ ...prev, [selectedLanguage.id]: value }));
      }
    },
    [selectedLanguage],
  );

  const updateCodeMap = useCallback((id, value) => {
    setCodeMap((prev) => ({ ...prev, [id]: value }));
  }, []);

  return {
    languages,
    selectedLanguage,
    selectedLanguageId: selectedLanguage?.id ?? null,
    codeMap,
    isLoading,
    error,
    selectLanguage,
    getMonacoLanguage: (name) => getMonacoLanguage(name ?? selectedLanguage?.name ?? ""),
    code,
    setCode,
    setCodeForSelected,
    updateCodeMap,
  };
}