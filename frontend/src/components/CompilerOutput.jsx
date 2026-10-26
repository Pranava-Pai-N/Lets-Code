import React from "react";

const CompilerOutput = ({ output, error }) => {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-md font-mono text-sm h-64 overflow-auto border border-zinc-300 dark:border-zinc-700">
      {error ? (
        <pre className="text-red-500">{error}</pre>
      ) : (
        <pre className="text-green-600">{output}</pre>
      )}
    </div>
  );
};

export default CompilerOutput;
