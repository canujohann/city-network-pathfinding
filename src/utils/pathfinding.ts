export interface City {
  id: number;
  name: string;
  x: number;
  y: number;
}

export interface Road {
  from: number;
  to: number;
  distance: number;
}

export interface Step {
  current: number | null;
  visited: number[];
  distances: { [key: number]: number };
  previous: { [key: number]: number | null };
}

export interface DijkstraResult {
  path: number[];
  distance: number;
  steps: Step[];
}

export function dijkstra(
  cities: City[],
  roads: Road[],
  startId: number,
  endId: number
): DijkstraResult {
  // Create adjacency list
  const graph: { [key: number]: { [key: number]: number } } = {};
  
  // Initialize graph
  cities.forEach(city => {
    graph[city.id] = {};
  });
  
  // Add roads to graph (bidirectional)
  roads.forEach(road => {
    graph[road.from][road.to] = road.distance;
    graph[road.to][road.from] = road.distance; // Assuming roads are bidirectional
  });
  
  // Initialize distances, previous nodes, and visited set
  const distances: { [key: number]: number } = {};
  const previous: { [key: number]: number | null } = {};
  const visited: number[] = [];
  
  // Initialize all distances as infinity and previous as null
  cities.forEach(city => {
    distances[city.id] = Infinity;
    previous[city.id] = null;
  });
  
  // Distance from start to start is 0
  distances[startId] = 0;
  
  // Array to store algorithm steps for visualization
  const steps: Step[] = [];
  
  // Find all unvisited nodes
  const unvisited = cities.map(city => city.id);
  
  // While there are unvisited nodes
  while (unvisited.length > 0) {
    // Find the unvisited node with the smallest distance
    let current: number | null = null;
    let smallestDistance = Infinity;
    
    unvisited.forEach(cityId => {
      if (distances[cityId] < smallestDistance) {
        smallestDistance = distances[cityId];
        current = cityId;
      }
    });
    
    // If we can't find a node or we've reached the end, break
    if (current === null || current === endId || smallestDistance === Infinity) {
      break;
    }
    
    // Remove current from unvisited
    const currentIndex = unvisited.indexOf(current);
    unvisited.splice(currentIndex, 1);
    
    // Add to visited
    visited.push(current);
    
    // Save current step
    steps.push({
      current,
      visited: [...visited],
      distances: { ...distances },
      previous: { ...previous }
    });
    
    // For each neighbor of current
    Object.entries(graph[current]).forEach(([neighborIdStr, distance]) => {
      const neighborId = parseInt(neighborIdStr);
      
      // Skip if neighbor is already visited
      if (visited.includes(neighborId)) return;
      
      // Calculate new distance
      const newDistance = distances[current] + distance;
      
      // If new distance is smaller, update
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = current;
      }
    });
  }
  
  // Add final step
  steps.push({
    current: null,
    visited: [...visited],
    distances: { ...distances },
    previous: { ...previous }
  });
  
  // Build path
  const path: number[] = [];
  let current = endId;
  
  // If there's no path to the end
  if (previous[endId] === null && startId !== endId) {
    return { path: [], distance: 0, steps };
  }
  
  // Reconstruct path
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  return {
    path,
    distance: distances[endId],
    steps
  };
}