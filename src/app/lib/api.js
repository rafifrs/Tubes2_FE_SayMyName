// project/fe/src/app/lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * api untuk BFS
 * @param {string} targetElementName - nama target elemen
 * @param {number} maxPaths - maks path yang dicari
 * @returns {Promise<Object>} - results
 */
export async function fetchBFSPaths(targetElementName, maxPaths) {
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
    return data.results;
  } catch (error) {
    console.error('Error fetching BFS paths:', error);
    throw error;
  }
}


export async function fetchDFSPaths(targetElementName, maxPaths) {
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
    return data.results;
  } catch (error) {
    console.error('Error fetching DFS paths:', error);
    throw error;
  }
}


export async function fetchDFSMultiplePaths(targetElementName, maxPaths) {
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
    return data.results;
  } catch (error) {
    console.error('Error fetching DFS multiple paths:', error);
    throw error;
  }
}