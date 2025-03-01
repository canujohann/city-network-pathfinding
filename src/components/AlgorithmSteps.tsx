import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Step, City } from '../utils/pathfinding';

interface AlgorithmStepsProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  cities: City[];
}

export const AlgorithmSteps: React.FC<AlgorithmStepsProps> = ({
  steps,
  currentStep,
  setCurrentStep,
  cities
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, steps.length, setCurrentStep]);
  
  const handlePrevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };
  
  const handleNextStep = () => {
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };
  
  const togglePlayPause = () => {
    if (currentStep === steps.length - 1) {
      // If at the end, restart from beginning
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  
  const getCityName = (id: number) => {
    const city = cities.find(c => c.id === id);
    return city ? city.name : `City ${id}`;
  };
  
  const currentStepData = steps[currentStep];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Algorithm Steps</h2>
      
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevStep}
          disabled={currentStep <= 0}
          className={`p-1 rounded ${
            currentStep <= 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="text-sm font-medium">
          Step {currentStep + 1} of {steps.length}
        </div>
        
        <button
          onClick={handleNextStep}
          disabled={currentStep >= steps.length - 1}
          className={`p-1 rounded ${
            currentStep >= steps.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <button
        onClick={togglePlayPause}
        className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        {isPlaying ? (
          <>
            <Pause size={16} className="mr-1" /> Pause
          </>
        ) : (
          <>
            <Play size={16} className="mr-1" /> {currentStep === steps.length - 1 ? 'Restart' : 'Play'}
          </>
        )}
      </button>
      
      {currentStepData && (
        <div className="text-sm">
          <div className="mb-2">
            <span className="font-medium">Current city:</span>{' '}
            {currentStepData.current ? (
              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                {getCityName(currentStepData.current)}
              </span>
            ) : (
              <span className="italic text-gray-500">None</span>
            )}
          </div>
          
          <div className="mb-2">
            <span className="font-medium">Visited cities:</span>{' '}
            {currentStepData.visited.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {currentStepData.visited.map(cityId => (
                  <span key={cityId} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    {getCityName(cityId)}
                  </span>
                ))}
              </div>
            ) : (
              <span className="italic text-gray-500">None</span>
            )}
          </div>
          
          <div>
            <span className="font-medium">Current distances:</span>
            <div className="mt-1 grid grid-cols-2 gap-1">
              {Object.entries(currentStepData.distances)
                .filter(([cityId]) => cityId !== 'undefined')
                .map(([cityId, distance]) => (
                  <div key={cityId} className="flex items-center text-xs">
                    <span className="mr-1">{getCityName(parseInt(cityId))}:</span>
                    <span className={`font-medium ${
                      distance === Infinity ? 'text-gray-500' : 'text-blue-600'
                    }`}>
                      {distance === Infinity ? '∞' : distance}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};