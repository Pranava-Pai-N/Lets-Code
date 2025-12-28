import React from "react";

const CompilerOutput = ({ output, error }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md font-mono text-sm h-64 overflow-auto border border-gray-300 dark:border-gray-700">
      {error ? (
        <pre className="text-red-500">{error}</pre>
      ) : (
        <pre className="text-green-600">{output}</pre>
      )}
    </div>
  );
};

export default CompilerOutput;
