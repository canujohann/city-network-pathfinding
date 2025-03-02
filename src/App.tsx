import React, { useState, useRef, useCallback } from 'react';
import { Navigation, Plus, Minus, Map as MapIcon } from 'lucide-react';
import { CityNetwork } from './components/CityNetwork';
import { City, Road, dijkstra, Step } from './utils/pathfinding';
import { AlgorithmSteps } from './components/AlgorithmSteps';
import { RouteInfo } from './components/RouteInfo';
import { ControlPanel } from './components/ControlPanel';

function App() {
  const [cities, setCities] = useState<City[]>([
    { id: 1, name: 'New York', x: 80, y: 40 },
    { id: 2, name: 'Boston', x: 90, y: 30 },
    { id: 3, name: 'Washington DC', x: 75, y: 50 },
    { id: 4, name: 'Chicago', x: 60, y: 35 },
    { id: 5, name: 'Miami', x: 80, y: 80 },
    { id: 6, name: 'Dallas', x: 45, y: 65 },
    { id: 7, name: 'Los Angeles', x: 15, y: 60 },
    { id: 8, name: 'San Francisco', x: 10, y: 45 },
    { id: 9, name: 'Seattle', x: 15, y: 20 },
    { id: 10, name: 'Denver', x: 40, y: 45 },
  ]);

  const [roads, setRoads] = useState<Road[]>([
    { from: 1, to: 2, distance: 215 },
    { from: 1, to: 3, distance: 225 },
    { from: 1, to: 4, distance: 790 },
    { from: 2, to: 3, distance: 440 },
    { from: 3, to: 5, distance: 1020 },
    { from: 4, to: 10, distance: 1000 },
    { from: 4, to: 6, distance: 920 },
    { from: 5, to: 6, distance: 1340 },
    { from: 6, to: 7, distance: 1430 },
    { from: 7, to: 8, distance: 380 },
    { from: 8, to: 9, distance: 810 },
    { from: 9, to: 10, distance: 1330 },
    { from: 10, to: 7, distance: 1020 },
  ]);

  const [startCity, setStartCity] = useState<City | null>(null);
  const [endCity, setEndCity] = useState<City | null>(null);
  const [path, setPath] = useState<number[]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [algorithmSteps, setAlgorithmSteps] = useState<Step[]>([]);
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isSchematicView, setIsSchematicView] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [isAddingCity, setIsAddingCity] = useState<boolean>(false);
  const [isAddingRoad, setIsAddingRoad] = useState<boolean>(false);
  const [roadStart, setRoadStart] = useState<City | null>(null);
  const [newCityName, setNewCityName] = useState<string>('');
  const [newRoadDistance, setNewRoadDistance] = useState<string>('');

  const networkRef = useRef<HTMLDivElement>(null);

  /**
  * Handles the click event on a city in the map. If the user is in "add road" mode, 
  * it either sets the start city for the new road or adds the new road between the start and end cities. 
  * If the user is not in "add road" mode, it sets the start or end city for the route calculation, 
  * or resets the route if a new start city is selected.
  **/
  const handleCityClick = useCallback((city: City) => {
    if (isAddingRoad) {
      if (!roadStart) {
        setRoadStart(city);
      } else if (roadStart.id !== city.id) {
        // Add new road
        const newRoad: Road = {
          from: roadStart.id,
          to: city.id,
          distance: parseInt(newRoadDistance) || 100
        };
        setRoads(prevRoads => [...prevRoads, newRoad]);
        setRoadStart(null);
        setIsAddingRoad(false);
        setNewRoadDistance('');
      }
      return;
    }

    if (!startCity) {
      setStartCity(city);
    } else if (!endCity) {
      setEndCity(city);
    } else {
      // Reset and set new start
      setStartCity(city);
      setEndCity(null);
      setPath([]);
      setTotalDistance(0);
      setAlgorithmSteps([]);
      setCurrentStep(-1);
    }
  }, [isAddingRoad, roadStart, newRoadDistance, startCity, endCity]);

  /**
   * Handles the click event on the map when the user is in "add city" mode.
   * Calculates the position of the new city based on the click event coordinates,
   * creates a new city object, and adds it to the list of cities.
   * 
   * @param e - The React mouse event object containing the click coordinates.
   */
  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingCity || !networkRef.current) return;

    const rect = networkRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newId = Math.max(...cities.map(c => c.id)) + 1;
    const newCity: City = {
      id: newId,
      name: newCityName || `City ${newId}`,
      x,
      y
    };

    setCities(prevCities => [...prevCities, newCity]);
    setIsAddingCity(false);
    setNewCityName('');
  }, [isAddingCity, cities, newCityName]);

  /**
   * Calculates the shortest path between the start and end cities using the Dijkstra algorithm.
   * Updates the state with the calculated path, total distance, and algorithm steps.
   */
  const calculateRoute = useCallback(() => {
    if (!startCity || !endCity) return;

    const { path: shortestPath, distance, steps } = dijkstra(
      cities,
      roads,
      startCity.id,
      endCity.id
    );

    setPath(shortestPath);
    setTotalDistance(distance);
    setAlgorithmSteps(steps);
    setCurrentStep(-1);
  }, [startCity, endCity, cities, roads]);

  /**
   * Resets the current route selection, clearing the start and end cities, path, total distance,
   * algorithm steps, and hiding the step-by-step display.
   */
  const resetSelection = useCallback(() => {
    setStartCity(null);
    setEndCity(null);
    setPath([]);
    setTotalDistance(0);
    setAlgorithmSteps([]);
    setCurrentStep(-1);
    setShowSteps(false);
  }, []);

  /**
   * Toggles the view between schematic and geographic modes.
   */
  const toggleView = useCallback(() => {
    setIsSchematicView(prev => !prev);
  }, []);

  /**
   * Increases the zoom level of the map, up to a maximum of 2.
   */
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  }, []);

  /**
   * Decreases the zoom level of the map, down to a minimum of 0.5.
   */
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  /**
   * Starts the process of adding a new city to the network.
   * This function sets the `isAddingCity` state to true, `isAddingRoad` state to false,
   * and clears the `roadStart` state.
   */
  const startAddingCity = useCallback(() => {
    setIsAddingCity(true);
    setIsAddingRoad(false);
    setRoadStart(null);
  }, []);

  const startAddingRoad = useCallback(() => {
    setIsAddingRoad(true);
    setIsAddingCity(false);
    setRoadStart(null);
  }, []);

  const cancelAdding = useCallback(() => {
    setIsAddingCity(false);
    setIsAddingRoad(false);
    setRoadStart(null);
    setNewCityName('');
    setNewRoadDistance('');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Navigation className="mr-2" /> City Network Pathfinder
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={toggleView}
              className="flex items-center bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
            >
              <MapIcon className="mr-1" size={16} />
              {isSchematicView ? 'Geographic View' : 'Schematic View'}
            </button>
            <button
              onClick={handleZoomIn}
              className="bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded"
            >
              <Minus size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 flex flex-col md:flex-row flex-grow">
        <div className="md:w-3/4 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0 md:mr-4 flex flex-col">
          <div
            ref={networkRef}
            onClick={handleMapClick}
            className="relative flex-grow border border-gray-300 rounded-lg overflow-hidden"
            style={{
              backgroundImage: isSchematicView ? 'none' : 'url(https://images.fineartamerica.com/images-medium-large-5/1-united-states-satellite-image-science-photo-library.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: isAddingCity ? 'crosshair' : 'default'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {isSchematicView && (
                <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
              )}
              <CityNetwork
                cities={cities}
                roads={roads}
                startCity={startCity}
                endCity={endCity}
                path={path}
                zoom={zoom}
                isSchematicView={isSchematicView}
                onCityClick={handleCityClick}
                roadStart={roadStart}
                currentStep={currentStep >= 0 ? algorithmSteps[currentStep] : null}
              />
            </div>
          </div>

          {isAddingCity && (
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg flex items-center">
              <input
                type="text"
                placeholder="City name"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                className="flex-grow p-2 border rounded mr-2"
              />
              <button
                onClick={cancelAdding}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          )}

          {isAddingRoad && (
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg flex items-center">
              {!roadStart ? (
                <p>Select the first city for the road</p>
              ) : (
                <>
                  <p className="mr-2">From {roadStart.name} to:</p>
                  <input
                    type="number"
                    placeholder="Distance (miles)"
                    value={newRoadDistance}
                    onChange={(e) => setNewRoadDistance(e.target.value)}
                    className="flex-grow p-2 border rounded mr-2"
                  />
                </>
              )}
              <button
                onClick={cancelAdding}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="md:w-1/4 flex flex-col">
          <ControlPanel
            startCity={startCity}
            endCity={endCity}
            calculateRoute={calculateRoute}
            resetSelection={resetSelection}
            showSteps={showSteps}
            setShowSteps={setShowSteps}
            startAddingCity={startAddingCity}
            startAddingRoad={startAddingRoad}
            isAddingCity={isAddingCity}
            isAddingRoad={isAddingRoad}
          />

          {path.length > 0 && (
            <RouteInfo
              cities={cities}
              path={path}
              totalDistance={totalDistance}
            />
          )}

          {showSteps && algorithmSteps.length > 0 && (
            <AlgorithmSteps
              steps={algorithmSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              cities={cities}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;