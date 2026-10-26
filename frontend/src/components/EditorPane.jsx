import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Map,
  X,
  FileCode2,
} from "lucide-react";

const MONACO_THEME = "letscode-dark";

const defineTheme = (monaco) => {
  monaco.editor.defineTheme(MONACO_THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6b7280", fontStyle: "italic" },
      { token: "keyword", foreground: "c084fc" },
      { token: "string", foreground: "34d399" },
      { token: "number", foreground: "fbbf24" },
      { token: "type", foreground: "60a5fa" },
      { token: "function", foreground: "f472b6" },
    ],
    colors: {
      "editor.background": "#09090b",
      "editor.foreground": "#e4e4e7",
      "editorLineNumber.foreground": "#52525b",
      "editor.selectionBackground": "#312e81",
      "editor.inactiveSelectionBackground": "#1e1b4b",
      "editorCursor.foreground": "#a5b4fc",
      "editorIndentGuide.background": "#27272a",
      "scrollbarSlider.background": "#27272a80",
      "scrollbarSlider.hoverBackground": "#3f3f46",
      "scrollbarSlider.activeBackground": "#52525b",
    },
  });
};

const extFor = (lang) => {
  if (lang === "python") return "py";
  if (lang === "javascript") return "js";
  if (lang === "typescript") return "ts";
  if (lang === "java") return "java";
  if (lang === "cpp") return "cpp";
  if (lang === "csharp") return "cs";
  if (lang === "go") return "go";
  if (lang === "rust") return "rs";
  return "txt";
};

export const EditorPane = ({ code, onCodeChange, language, monacoLanguage, isFullscreen, onToggleFullscreen }) => {
  const [files, setFiles] = useState([
    { id: "main", name: `main.${extFor(monacoLanguage)}`, content: code, language: monacoLanguage },
  ]);
  const [activeFileId, setActiveFileId] = useState("main");
  const [fontSize, setFontSize] = useState(14);
  const [minimap, setMinimap] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId ? { ...f, content: code, language: monacoLanguage, name: `main.${extFor(monacoLanguage)}` } : f,
      ),
    );
  }, [code, monacoLanguage, activeFileId]);

  const activeFile = files.find((f) => f.id === activeFileId) ?? files[0];

  const handleEditorChange = (value) => {
    const next = value ?? "";
    setFiles((prev) => prev.map((f) => (f.id === activeFileId ? { ...f, content: next } : f)));
    onCodeChange(next);
  };

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    defineTheme(monaco);
    monaco.editor.setTheme(MONACO_THEME);
  };

  const addFile = () => {
    const id = `file-${Date.now()}`;
    setFiles((prev) => [...prev, { id, name: `untitled-${prev.length + 1}.txt`, content: "", language: "plaintext" }]);
    setActiveFileId(id);
  };

  const closeFile = (id) => {
    setFiles((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((f) => f.id !== id);
      if (activeFileId === id) setActiveFileId(next[next.length - 1].id);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col bg-[#09090b]">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 px-3 py-2">
        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <FileCode2 className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-medium text-zinc-800 dark:text-zinc-200">{language?.name ?? "Language"}</span>
          <span className="hidden text-zinc-600 sm:inline">•</span>
          <span className="hidden sm:inline">{activeFile?.name}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setFontSize((s) => Math.max(10, s - 1))}
            className="rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            title="Decrease font size"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[2rem] text-center text-xs text-zinc-600 dark:text-zinc-400">{fontSize}</span>
          <button
            onClick={() => setFontSize((s) => Math.min(24, s + 1))}
            className="rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            title="Increase font size"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setMinimap((m) => !m)}
            className={`rounded-md p-1.5 transition ${minimap ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"}`}
            title="Toggle minimap"
          >
            <Map className="h-3.5 w-3.5" />
          </button>
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 px-2 py-1">
        {files.map((f) => {
          const active = f.id === activeFileId;
          return (
            <div
              key={f.id}
              className={`group flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition ${
                active ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <button onClick={() => setActiveFileId(f.id)} className="flex items-center gap-1.5">
                <FileCode2 className="h-3 w-3" />
                {f.name}
              </button>
              {files.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(f.id);
                  }}
                  className="rounded p-0.5 opacity-0 transition group-hover:opacity-100 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}
        <button
          onClick={addFile}
          className="rounded-md p-1 text-zinc-500 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200"
          title="New file"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          theme={MONACO_THEME}
          language={activeFile?.language ?? monacoLanguage}
          value={activeFile?.content ?? ""}
          onChange={handleEditorChange}
          onMount={handleMount}
          options={{
            minimap: { enabled: minimap },
            fontSize,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: "all",
            fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
          }}
        />
      </div>
    </div>
  );
};

export default EditorPane;