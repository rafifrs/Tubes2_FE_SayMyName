// app/page.js
'use client';

import { useState, useEffect } from 'react';
import MethodSelector from './components/MethodSelector';
import RecipeModeSelector from './components/RecipeSelector';
import RecipeCountInput from './components/RecipeCountInput';
import GoButton from './components/GoButton';
import ResultsDisplay from './components/ResultDisplay';
import ElementSearch from './components/ElementSearch';
import { useCallback } from 'react';
import { fetchBFSPaths, fetchDFSPaths, fetchDFSMultiplePaths } from './lib/api';
import TabTreeContainer from './components/TabTreeContainer';
import MyTree from './components/Tree';

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);

  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    method: '',
    mode: '',
    count: 1,
    targetElement: ''
  });

  // State for form validity
  const [validity, setValidity] = useState({
    targetElement: false,
    method: false,
    mode: false,
    count: true,
  });

  // State for enabling recipe count selector
  const [showRecipeCount, setShowRecipeCount] = useState(false);

  // State for results and loading
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for available elements (would come from API in real app)
  const [elements, setElements] = useState([]);

  // Check if form is valid
  const isFormValid = validity.targetElement && validity.method && validity.mode && validity.count;

  const handleSearchUsingAPI  = async (method, count, mode) => {
    console.log('KEPANGGGIL GA SI');
    setIsLoading(true);
    setError(null);
    console.log('Searching for recipes with params:', searchParams);
    console.log('Method:', method);
    console.log('Count:', count);
    console.log('Mode:', mode);
    if (method === 'bfs') {
      console.log('BFS called');
      try {
        const response = await fetchBFSPaths(searchParams.targetElement, searchParams.count);
        // console.log('API responseuk:', response?.Results?.[0]?.Path || []);
        setResults(response);
        setHasSearched(true); 
      } catch (err) {
        console.error('Error during search:', err);
        setError('Search failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    else if (method === 'dfs') {
      if (count === 1 || mode === 'single' || (mode === 'multiple' && count === 1)) {
        console.log('DFS single called');
        try {
          const response = await fetchDFSPaths(searchParams.targetElement, searchParams.count);
          console.log('API responseuk:', response?.Path || []);
          setResults(response);
          setHasSearched(true); 
        } catch (err) {
          console.error('Error during search:', err);
          setError('Search failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
      else if (count > 1 || mode === 'multiple') {
        console.log('DFS multiple called');
        try {
          const response = await fetchDFSMultiplePaths(searchParams.targetElement, searchParams.count);
          console.log('API responseuk:', response || []);
          setResults(response);
          setHasSearched(true); 
        } catch (err) {
          console.error('Error during search:', err);
          setError('Search failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    }

  }

  // Update form parameters
  const handleTargetElementChange = useCallback((element) => {
    setSearchParams((prev) => ({ ...prev, targetElement: element }));
  }, []);

  const handleMethodChange = useCallback((method) => {
    setSearchParams((prev) => ({ ...prev, method }));
  }, []);

  const handleModeChange = useCallback((mode) => {
    setSearchParams((prev) => ({ ...prev, mode }));
  }, []);

  const handleCountChange = useCallback((count) => {
    setSearchParams((prev) => ({ ...prev, count: Number(count) }));
  }, []);

  // Update validity states
  const handleTargetElementValidityChange = useCallback((isValid) => {
    setValidity((prev) => ({ ...prev, targetElement: isValid }));
  }, []);

  const handleMethodValidityChange = useCallback((isValid) => {
    setValidity((prev) => ({ ...prev, method: isValid }));
  }, []);

  const handleModeValidityChange = useCallback((isValid) => {
    setValidity((prev) => ({ ...prev, mode: isValid }));
  }, []);

  const handleCountValidityChange = useCallback((isValid) => {
    setValidity((prev) => ({ ...prev, count: isValid }));
  }, []);

  useEffect(() => {
    setHasSearched(false);
    setResults(null); // Optional: clear previous results
  }, [searchParams.method, searchParams.count, searchParams.targetElement]);
  

  return (
    <div className="min-h-screen bg-[#1b001c] text-white">
      <div className="mx-auto container px-4 py-8">
        {/* Header with logo */}
        <div className="flex items-center mb-8 justify-center text-center">
          <img src="/logo.webp" alt="Logo" className="h-12 mr-4" />
          <h1 className="text-2xl font-bold">Little Alchemy 2 Solver</h1>
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Row 1: Controls */}
          <div className="col-span-3 h-16">
            <ElementSearch 
              onElementSelect={handleTargetElementChange}
              onValidityChange={handleTargetElementValidityChange}
            />
          </div>
          <div className="col-span-3 h-16">
            <MethodSelector 
              onChange={handleMethodChange}
              onValidityChange={handleMethodValidityChange}
            />
          </div>
          <div className="col-span-3 h-16">
            <RecipeModeSelector 
              onChange={handleModeChange}
              onValidityChange={handleModeValidityChange}
              onMultipleSelected={setShowRecipeCount}
            />
          </div>
          <div className="col-span-2 h-16">
            <RecipeCountInput
              onChange={handleCountChange}
              onValidityChange={handleCountValidityChange}
              isEnabled={showRecipeCount}
            />
          </div>
          <div className="col-span-1 h-16">
          <GoButton 
            onClick={() => handleSearchUsingAPI(searchParams.method, searchParams.count, searchParams.mode)} 
            isEnabled={isFormValid}
            isLoading={isLoading}
          />
          </div>

          {/* Row 2-3: Results dengan Tabs */}
          <div className="col-span-8 row-span-2 bg-[#260026] bg-opacity-30 rounded-lg border-2 border-[#c426a4] h-[calc(100vh-230px)]">
            {hasSearched && results && searchParams.method === 'bfs' && searchParams.count === 1 && (
              <MyTree result={results?.Results?.[0]?.Path || []} />
            )}
            {hasSearched && results && searchParams.method === 'dfs' && searchParams.count === 1 && (
              <MyTree result={results?.Path || []}/>
            )}
            {hasSearched && results && searchParams.method === 'dfs' && searchParams.count > 1 && (
              <TabTreeContainer trees={results} method={searchParams.method} />
            )}
            {hasSearched && results && searchParams.method === 'bfs' && searchParams.count > 1 && (
              <TabTreeContainer trees={results} method={searchParams.method} />
            )}
          </div>

          <div className="col-span-4 row-span-2 bg-[#260026] bg-opacity-30 rounded-lg border-2 border-[#c426a4] h-[calc(100vh-230px)]">
          {results && (
            <ResultsDisplay 
              results={results}
              isLoading={isLoading}
            />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}