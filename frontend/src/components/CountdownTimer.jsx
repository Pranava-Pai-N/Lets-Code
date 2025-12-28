import React, { useState, useEffect, useRef } from "react";
import Button from "./Button.jsx";
import { ClockIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline"; 

const CountdownTimer = () => {
  const [time, setTime] = useState(60); 
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          return 0; 
        }
        return prev - 1; 
      });
    }, 1000); 

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const addMinute = () => {
    setTime((prev) => prev + 60);
  };

  const subtractMinute = () => {
    if(time === 60){
      return;
    }
    setTime((prev) => Math.max(prev - 60, 0));
  };

  const handleStartPause = () => {
    if (time <= 0) 
      return; 
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setTime(60); 
    setIsRunning(false);
  };

  const isComplete = time === 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-xs sm:max-w-none flex items-center justify-between space-x-4">
      
      <div className="flex items-center space-x-2 flex-shrink-0">
        <ClockIcon className={`w-6 h-6 ${isComplete ? "text-red-500" : "text-indigo-500 dark:text-indigo-400"}`} />
        <div className="text-left">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-none">
                {isComplete ? "TIME EXPIRED" : "TIME REMAINING"}
            </p>
            <div className={`
                text-xl font-bold transition-colors duration-300 leading-none mt-1 flex items-center gap-2
                ${isComplete ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}
            `}>
                {formatTime(time)}
                
                <div className="flex flex-col ml-1">
                  <button 
                    onClick={addMinute}
                    className="hover:text-indigo-500 text-gray-400 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={subtractMinute}
                    className="hover:text-indigo-500 text-gray-400 transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                </div>
            </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        {isRunning ? (
            <Button variant="tertiary" onClick={handleStartPause} className="px-3 py-1 text-sm">
                Pause
            </Button>
        ) : (
            <Button 
                variant={isComplete ? "danger" : "primary"} 
                onClick={isComplete ? handleReset : handleStartPause} 
                className="px-3 py-1 text-sm"
            >
                {isComplete ? "Reset" : "Start"}
            </Button>
        )}
        
        {!isComplete && (
            <Button 
                variant="secondary" 
                onClick={handleReset} 
                className="px-3 py-1 text-sm"
            >
                Reset
            </Button>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;