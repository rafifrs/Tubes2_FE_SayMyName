'use state'

import { useState, useEffect } from 'react';
import { useCallback } from 'react';

export default function RecipeCountInput({ onChange, onValidityChange, isEnabled }) {
  const [count, setCount] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    onValidityChange(isEnabled ? count > 0 : true);
  }, [count, isEnabled, onValidityChange]);

  useEffect(() => {
    if (!isEnabled) {
      setCount(1);
    }
  }, [isEnabled]);
  

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setCount(value);
    setIsValid(/^\d+$/.test(value) && parseInt(value) > 0);
    onChange(value);
  }, [onChange]);

  return (
    <input
      type="number"
      value={count}
      disabled={!isEnabled}
      onChange={handleInputChange}
      className={`w-full h-full px-4 py-2 bg-opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c426a4] ${
        isValid ? 'text-white bg-[#390028]' : 'text-white bg-[#390028] text-xs'
        } ${isEnabled ? '' : 'cursor-not-allowed text-purple-300 bg-opacity-50'
      }`}
      placeholder="Number of Recipes"
    />
  );
}