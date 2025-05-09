import { useState } from 'react';

export default function ResultsDisplay({ results, isLoading }) {
  if (!results && !isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-purple-300">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-lg">Select parameters and click GO</p>
        <p className="text-sm opacity-75 mt-2">Results will appear here</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-purple-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#c426a4] mb-4"></div>
        <p className="text-lg">Calculating recipes...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6 overflow-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#390028] bg-opacity-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-100 mb-4 text-center">Search Results</h3>
          
          <div className="gap-4">
            <div className="bg-[#260026] bg-opacity-50 p-4 rounded-lg text-center mt-5">
              <p className="text-purple-300 text-sm">Execution Time</p>
              <p className="text-white text-xl font-bold"> ms</p>
            </div>
            
            <div className="bg-[#260026] bg-opacity-50 p-4 rounded-lg text-center mt-5">
              <p className="text-purple-300 text-sm">Nodes Visited</p>
              {/* <p className="text-white text-xl font-bold">{results.Results[0].NodesVisited.toLocaleString()}</p> */}
            </div>
            
            <div className="bg-[#260026] bg-opacity-50 p-4 rounded-lg text-center mt-5">
              <p className="text-purple-300 text-sm">Recipes Found</p>
              <p className="text-white text-xl font-bold">{results.length || 0}</p>
            </div>
          </div>
        </div>

        {results.recipes?.length > 1 && (
          <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-100 mb-2">Recipe Selection</h3>
            <div className="flex flex-wrap gap-2">
              {results.recipes.map((_, index) => (
                <button
                  key={index}
                  className="bg-[#c426a4] hover:bg-[#c426a4] text-white px-3 py-1 rounded-md text-sm transition-colors"
                  onClick={() => onSelectRecipe(index)}
                >
                  Recipe {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#390028] bg-opacity-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-100 mb-2">Target Element</h3>
          <div className="bg-[#260026] bg-opacity-50 p-3 rounded-lg">
            <p className="text-white font-medium">{results.targetElement}</p>
          </div>
        </div>
      </div>
    </div>
  );
}