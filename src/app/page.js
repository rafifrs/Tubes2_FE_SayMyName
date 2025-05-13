"use client";

import { useState, useEffect } from "react";
import MethodSelector from "./components/MethodSelector";
import RecipeModeSelector from "./components/RecipeSelector";
import RecipeCountInput from "./components/RecipeCountInput";
import GoButton from "./components/GoButton";
import ResultsDisplay from "./components/ResultDisplay";
import ElementSearch from "./components/ElementSearch";
import { useCallback } from "react";
import { fetchBFSPaths, fetchDFSPaths, fetchDFSMultiplePaths } from "./lib/api";
import TabTreeContainer from "./components/TabTreeContainer";
import MyTree from "./components/Tree";
import elementsWithImagesData from "./data/elements_with_images.json";

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);
  const [executionTimeDalamMs, setExecutionTimeDalamMs] = useState(0);
  const [nodesVisited, setNodesVisited] = useState(0);

  const [showRecipeCount, setShowRecipeCount] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({
    method: "",
    mode: "",
    count: 1,
    targetElement: "",
  });

  const [validity, setValidity] = useState({
    targetElement: false,
    method: false,
    mode: false,
    count: true,
  });

  const [error, setError] = useState(null);
  const isFormValid = validity.targetElement && validity.method && validity.mode && validity.count;

  const handleSearchUsingAPI = async (method, count, mode) => {
    setIsLoading(true);
    setError(null);

    const startTime = performance.now();

    if (method === "bfs") {
      try {
        const response = await fetchBFSPaths(searchParams.targetElement, searchParams.count);
        const endTime = performance.now();
        let visited = 0;
        if (response && response.Results) {
          for (let i = 0; i < response.Results.length; i++) {
            visited += response.Results[i].NodesVisited || 0;
          }
        }
        setNodesVisited(visited);
        setExecutionTimeDalamMs(endTime - startTime);
        setResults(response);
        setHasSearched(true);
      } catch (err) {
        console.error("Error during search:", err);
        setError("Search failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else if (method === "dfs") {
      if (count === 1 || mode === "single" || (mode === "multiple" && count === 1)) {
        try {
          const response = await fetchDFSPaths(searchParams.targetElement, searchParams.count);
          const endTime = performance.now();
          setExecutionTimeDalamMs(endTime - startTime);
          let visited = 0;
          visited += response && response.NodesVisited ? response.NodesVisited : 0;
          setNodesVisited(visited);
          setResults(response);
          setHasSearched(true);
        } catch (err) {
          console.error("Error during search:", err);
          setError("Search failed. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else if (count > 1 || mode === "multiple") {
        try {
          const response = await fetchDFSMultiplePaths(searchParams.targetElement, searchParams.count);
          const endTime = performance.now();
          setExecutionTimeDalamMs(endTime - startTime);
          let visited = 0;
          if (response && response.length) {
            for (let i = 0; i < response.length; i++) {
              visited += response[i].NodesVisited || 0;
            }
          }
          setNodesVisited(visited);
          setResults(response);
          setHasSearched(true);
        } catch (err) {
          console.error("Error during search:", err);
          setError("Search failed. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleTargetElementChange = useCallback((element) => {
    setSearchParams((prev) => ({ ...prev, targetElement: element }));
  }, []);

  const handleMethodChange = useCallback((method) => {
    setSearchParams((prev) => ({ ...prev, method }));
  }, []);

  const handleModeChange = useCallback((mode) => {
    setSearchParams((prev) => ({
      ...prev,
      mode,
      count: mode === "single" ? 1 : prev.count,
    }));
    if (mode === "single") {
      setValidity((prev) => ({ ...prev, count: true }));
    }
  }, []);

  const handleCountChange = useCallback((count) => {
    setSearchParams((prev) => ({ ...prev, count: Number(count) }));
  }, []);

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
    setResults(null);
  }, [searchParams.method, searchParams.count, searchParams.targetElement]);

  return (
    <div className="min-h-screen bg-[#1b001c] text-white">
      <div className="mx-auto container px-4 py-8">
        <div className="flex items-center mb-8 justify-center text-center">
          <img src="/logo.webp" alt="Logo" className="h-12 mr-4" />
          <h1 className="text-2xl font-bold">Little Alchemy 2 Solver</h1>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 h-16">
            <ElementSearch onElementSelect={handleTargetElementChange} onValidityChange={handleTargetElementValidityChange} />
          </div>
          <div className="col-span-3 h-16">
            <MethodSelector onChange={handleMethodChange} onValidityChange={handleMethodValidityChange} />
          </div>
          <div className="col-span-3 h-16">
            <RecipeModeSelector onChange={handleModeChange} onValidityChange={handleModeValidityChange} onMultipleSelected={setShowRecipeCount} onCountChange={handleCountChange} />
          </div>
          <div className="col-span-2 h-16">
            <RecipeCountInput onChange={handleCountChange} onValidityChange={handleCountValidityChange} isEnabled={showRecipeCount} />
          </div>
          <div className="col-span-1 h-16">
            <GoButton onClick={() => handleSearchUsingAPI(searchParams.method, searchParams.count, searchParams.mode)} isEnabled={isFormValid} isLoading={isLoading} />
          </div>

          <div className="col-span-8 row-span-2 bg-[#260026] bg-opacity-30 rounded-lg border-2 border-[#c426a4] h-[calc(100vh-230px)]">
            {hasSearched && results && searchParams.method === "bfs" && searchParams.count === 1 && <MyTree result={results?.Results?.[0]?.Path || []} elementsData={elementsWithImagesData} />}
            {hasSearched && results && searchParams.method === "bfs" && searchParams.count > 1 && <TabTreeContainer trees={results} method={searchParams.method} elementsData={elementsWithImagesData} />}
            {hasSearched && results && searchParams.method === "dfs" && searchParams.count === 1 && <MyTree result={results?.Path || []} elementsData={elementsWithImagesData} />}
            {hasSearched && results && searchParams.method === "dfs" && searchParams.count > 1 && <TabTreeContainer trees={results} method={searchParams.method} elementsData={elementsWithImagesData} />}
          </div>

          <div className="col-span-4 row-span-2 bg-[#260026] bg-opacity-30 rounded-lg border-2 border-[#c426a4] h-[calc(100vh-230px)]">
            {hasSearched && results && <ResultsDisplay results={results} isLoading={isLoading} method={searchParams.method} executionTime={executionTimeDalamMs} nodesVisited={nodesVisited} />}
          </div>
        </div>
      </div>
    </div>
  );
}
