import React from 'react';
import { Play, RotateCw, Plus, GitCommit, GitFork } from 'lucide-react';
import { City } from '../utils/pathfinding';

interface ControlPanelProps {
  startCity: City | null;
  endCity: City | null;
  calculateRoute: () => void;
  resetSelection: () => void;
  showSteps: boolean;
  setShowSteps: (show: boolean) => void;
  startAddingCity: () => void;
  startAddingRoad: () => void;
  isAddingCity: boolean;
  isAddingRoad: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  startCity,
  endCity,
  calculateRoute,
  resetSelection,
  showSteps,
  setShowSteps,
  startAddingCity,
  startAddingRoad,
  isAddingCity,
  isAddingRoad
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">Control Panel</h2>
      
      <div className="mb-4">
        <div className="mb-2">
          <span className="font-medium">Start:</span>{' '}
          {startCity ? (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {startCity.name}
            </span>
          ) : (
            <span className="text-gray-500 italic">Select a city</span>
          )}
        </div>
        
        <div className="mb-4">
          <span className="font-medium">Destination:</span>{' '}
          {endCity ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              {endCity.name}
            </span>
          ) : (
            <span className="text-gray-500 italic">Select a city</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={calculateRoute}
            disabled={!startCity || !endCity}
            className={`flex items-center px-3 py-2 rounded ${
              !startCity || !endCity
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Play size={16} className="mr-1" /> Calculate Route
          </button>
          
          <button
            onClick={resetSelection}
            className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            <RotateCw size={16} className="mr-1" /> Reset
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showSteps}
            onChange={(e) => setShowSteps(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Show algorithm steps</span>
        </label>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-md font-medium mb-2">Customize Network</h3>
        <div className="flex space-x-2">
          <button
            onClick={startAddingCity}
            disabled={isAddingCity || isAddingRoad}
            className={`flex items-center px-3 py-2 rounded ${
              isAddingCity || isAddingRoad
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <Plus size={16} className="mr-1" /> Add City
          </button>
          
          <button
            onClick={startAddingRoad}
            disabled={isAddingCity || isAddingRoad}
            className={`flex items-center px-3 py-2 rounded ${
              isAddingCity || isAddingRoad
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <GitFork size={16} className="mr-1" /> Add Road
          </button>
        </div>
      </div>
    </div>
  );
};