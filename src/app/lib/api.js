// project/fe/src/app/lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Fetch BFS pathfinding results
 * @param {string} targetElementName - The target element name to find paths to
 * @param {number} maxPaths - Maximum number of paths to find
 * @returns {Promise<Object>} - The pathfinding results
 */
export async function fetchBFSPaths(targetElementName, maxPaths) {
  console.log('Fetching BFS paths for:', targetElementName, 'with max paths:', maxPaths);
  try {
    const response = await fetch(`${API_BASE_URL}/api/pathfinding/bfs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetElementName,
        maxPaths,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch BFS paths');
    }

    const data = await response.json();
    console.log('BFS paths fetched successfully:', data.results);
    return data.results;
  } catch (error) {
    console.error('Error fetching BFS paths:', error);
    throw error;
  }
}


export async function fetchDFSPaths(targetElementName, maxPaths) {
  console.log('Fetching DFS paths for:', targetElementName, 'with max paths:', maxPaths);
  try {
    const response = await fetch(`${API_BASE_URL}/api/pathfinding/dfs-single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetElementName,
        maxPaths,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new error(errorData.error || 'Failed to fetch DFS paths');
    }

    const data = await response.json();
    console.log('DFS paths fetched successfully:', data.results);
    return data.results;
  } catch (error) {
    console.error('Error fetching DFS paths:', error);
    throw error;
  }
}


export async function fetchDFSMultiplePaths(targetElementName, maxPaths) {
  console.log('Fetching DFS multiple paths for:', targetElementName, 'with max paths:', maxPaths);
  try {
    const response = await fetch(`${API_BASE_URL}/api/pathfinding/dfs-multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetElementName,
        maxPaths,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch DFS multiple paths');
    }

    const data = await response.json();
    console.log('DFS multiple paths fetched successfully:', data.results);
    return data.results;
  } catch (error) {
    console.error('Error fetching DFS multiple paths:', error);
    throw error;
  }
}