import React from 'react';
import { City } from '../utils/pathfinding';

interface RouteInfoProps {
  cities: City[];
  path: number[];
  totalDistance: number;
}

export const RouteInfo: React.FC<RouteInfoProps> = ({
  cities,
  path,
  totalDistance
}) => {
  // Get city names from IDs
  const getCityName = (id: number) => {
    const city = cities.find(c => c.id === id);
    return city ? city.name : `City ${id}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">Route Information</h2>
      
      <div className="mb-3">
        <div className="font-medium text-green-700">
          Total Distance: {totalDistance} miles
        </div>
        <div className="text-sm text-gray-600">
          Estimated travel time: {Math.round(totalDistance / 60)} hours {Math.round(totalDistance % 60)} minutes
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Route Path:</h3>
        <ul className="space-y-2">
          {path.map((cityId, index) => (
            <li key={`path-${index}`} className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800 mr-2">
                {index + 1}
              </div>
              <span>{getCityName(cityId)}</span>
              {index < path.length - 1 && (
                <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};