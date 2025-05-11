'use client';

import { useState, useEffect } from 'react';
import { useCallback } from 'react';

export default function RecipeModeSelector({ onChange, onValidityChange, onMultipleSelected }) {
  const [mode, setMode] = useState('');
  const modes = ['Find Recipe', 'Multiple Recipe'];

  useEffect(() => {
    onValidityChange(!!mode);
    
    if (mode === 'multiple') {
      onMultipleSelected(true);
    } else {
      onMultipleSelected(false);
    }
  }, [mode, onValidityChange, onMultipleSelected]);

  const handleModeChange = useCallback((e) => {
    const selectedMode = e.target.value;
    setMode(selectedMode);
    onChange(selectedMode);
  }, [onChange]);

  return (
    <div className="relative w-full h-full">
      <select
        value={mode}
        onChange={handleModeChange}
        className={`w-full h-full px-4 py-2 bg-opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c426a4] appearance-none cursor-pointer ${
          mode ? 'text-white bg-[#390028]' : 'text-purple-300 bg-[#390028]'
        }`}
      >
        <option value="" disabled>Recipe Type</option>
        <option value="shortest">Find Recipe</option>
        <option value="multiple">Multiple Recipe</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}