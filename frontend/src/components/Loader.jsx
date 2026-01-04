import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-transparent">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse"></div>
        
        <div className="relative flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-mono font-bold text-indigo-500 animate-[bounce_1s_infinite_100ms]">
              &lt;
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
              <div className="w-2 h-8 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_300ms]"></div>
              <div className="w-2 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
            </div>
            <span className="text-4xl font-mono font-bold text-indigo-500 animate-[bounce_1s_infinite_500ms]">
              /&gt;
            </span>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-sm font-mono font-medium text-gray-500 dark:text-gray-400 tracking-tight flex items-center gap-1">
              <span>Entering the Matrix</span>
              <span className="flex">
                <span className="animate-[bounce_1s_infinite_100ms]">.</span>
                <span className="animate-[bounce_1s_infinite_200ms]">.</span>
                <span className="animate-[bounce_1s_infinite_300ms]">.</span>
              </span>
            </p>
            
            <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-1/2 animate-[load_1.5s_infinite_ease-in-out]"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes load {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default Loader;