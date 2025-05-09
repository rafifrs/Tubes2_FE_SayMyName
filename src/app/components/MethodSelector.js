'use client';

import { useState, useEffect } from 'react';
import { useCallback } from 'react';

export default function MethodSelector({ onChange, onValidityChange }) {
  const [method, setMethod] = useState('');
  const methods = ['BFS', 'DFS', 'Bidirectional'];

  useEffect(() => {
    onValidityChange(!!method);
  }, [method, onValidityChange]);

  const handleMethodChange = useCallback((e) => {
    const selectedMethod = e.target.value;
    setMethod(selectedMethod);
    onChange(selectedMethod);
  }, [onChange]);

  return (
    <div className="relative w-full h-full">
      <select
        value={method}
        onChange={handleMethodChange}
        className={`w-full h-full px-4 py-2 bg-opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c426a4] appearance-none cursor-pointer ${
          method ? 'text-white bg-[#390028]' : 'text-purple-300 bg-[#390028]'
        }`}
      >
        <option value="" disabled>Choose Method</option>
        {methods.map((m) => (
          <option key={m} value={m.toLowerCase()}>
            {m}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}