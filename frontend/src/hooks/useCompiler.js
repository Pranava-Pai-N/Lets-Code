import { useCompiler as useCompilerContext } from "../context/compilerContext.jsx";

const useCompiler = () => {
  const {
    code,
    setCode,
    language,
    setLanguage,
    output,
    error,
    isRunning,
    runCode,
  } = useCompilerContext();

  return {
    code,
    setCode,
    language,
    setLanguage,
    output,
    error,
    isRunning,
    runCode,
  };
};

export default useCompiler;
