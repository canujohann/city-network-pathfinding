import React from 'react';
import { MapPin, Circle } from 'lucide-react';
import { City, Road, Step } from '../utils/pathfinding';

interface CityNetworkProps {
  cities: City[];
  roads: Road[];
  startCity: City | null;
  endCity: City | null;
  path: number[];
  zoom: number;
  isSchematicView: boolean;
  onCityClick: (city: City) => void;
  roadStart: City | null;
  currentStep: Step | null;
}

export const CityNetwork: React.FC<CityNetworkProps> = ({
  cities,
  roads,
  startCity,
  endCity,
  path,
  zoom,
  isSchematicView,
  onCityClick,
  roadStart,
  currentStep
}) => {
  // Function to check if a road is part of the path
  const isRoadInPath = (from: number, to: number) => {
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (path[i] === from && path[i + 1] === to) ||
        (path[i] === to && path[i + 1] === from)
      ) {
        return true;
      }
    }
    return false;
  };

  // Function to check if a city is visited in the current algorithm step
  const isCityVisited = (cityId: number) => {
    if (!currentStep) return false;
    return currentStep.visited.includes(cityId);
  };

  // Function to check if a city is the current city in the algorithm step
  const isCurrentCity = (cityId: number) => {
    if (!currentStep) return false;
    return currentStep.current === cityId;
  };

  // Function to get the distance label for a city in the current algorithm step
  const getDistanceLabel = (cityId: number) => {
    if (!currentStep) return null;
    const distance = currentStep.distances[cityId];
    if (distance === Infinity) return '∞';
    return distance;
  };

  return (
    <div 
      className="absolute inset-0"
      style={{ transform: `scale(${zoom})` }}
    >
      {/* Render roads */}
      {roads.map((road) => {
        const fromCity = cities.find((c) => c.id === road.from);
        const toCity = cities.find((c) => c.id === road.to);
        
        if (!fromCity || !toCity) return null;
        
        const isInPath = isRoadInPath(road.from, road.to);
        
        return (
          <svg
            key={`road-${road.from}-${road.to}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <line
              x1={`${fromCity.x}%`}
              y1={`${fromCity.y}%`}
              x2={`${toCity.x}%`}
              y2={`${toCity.y}%`}
              stroke={isInPath ? '#4CAF50' : '#CBD5E0'}
              strokeWidth={isInPath ? 3 : 1.5}
              strokeDasharray={isSchematicView ? 'none' : '5,5'}
            />
            <text
              x={`${(fromCity.x + toCity.x) / 2}%`}
              y={`${(fromCity.y + toCity.y) / 2 - 1}%`}
              textAnchor="middle"
              fill={isInPath ? '#2C7A30' : '#4A5568'}
              fontSize="10"
              className="pointer-events-none"
            >
              {road.distance} mi
            </text>
          </svg>
        );
      })}

      {/* Render cities */}
      {cities.map((city) => {
        const isStart = startCity?.id === city.id;
        const isEnd = endCity?.id === city.id;
        const isInPath = path.includes(city.id);
        const isVisited = isCityVisited(city.id);
        const isCurrent = isCurrentCity(city.id);
        const distanceLabel = getDistanceLabel(city.id);
        
        let bgColor = 'bg-gray-100';
        let textColor = 'text-gray-700';
        
        if (isStart) {
          bgColor = 'bg-blue-500';
          textColor = 'text-white';
        } else if (isEnd) {
          bgColor = 'bg-green-500';
          textColor = 'text-white';
        } else if (isInPath) {
          bgColor = 'bg-green-200';
          textColor = 'text-green-800';
        } else if (isCurrent) {
          bgColor = 'bg-yellow-400';
          textColor = 'text-yellow-900';
        } else if (isVisited) {
          bgColor = 'bg-blue-200';
          textColor = 'text-blue-800';
        }
        
        const isRoadStartCity = roadStart?.id === city.id;
        
        return (
          <div
            key={`city-${city.id}`}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer`}
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
            onClick={() => onCityClick(city)}
          >
            <div className={`flex flex-col items-center`}>
              <div 
                className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center shadow-md ${
                  isRoadStartCity ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {isSchematicView ? (
                  <Circle className={`${textColor}`} size={16} />
                ) : (
                  <MapPin className={`${textColor}`} size={16} />
                )}
              </div>
              <div className="mt-1 px-2 py-0.5 bg-white/90 rounded text-xs font-medium shadow">
                {city.name}
              </div>
              
              {distanceLabel !== null && (
                <div className="mt-1 px-2 py-0.5 bg-yellow-100 rounded text-xs font-medium shadow">
                  {distanceLabel}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};