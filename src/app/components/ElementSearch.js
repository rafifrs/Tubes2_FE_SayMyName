import { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';

export default function ElementSearch({ onElementSelect, onValidityChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredElements, setFilteredElements] = useState([]);
  const dropdownRef = useRef(null);

  const alljson = require('../../../elements.json');
  const elements = alljson.map(element => element.name);

  // Filter elements berdasarkan searhh query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredElements([]);
    } else {
      const filtered = elements.filter(element => 
        element.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10); // Limit to 10 results for performance
      setFilteredElements(filtered);
    }
  }, [searchQuery]);

  // Handle perubahan pada selectedElement
  useEffect(() => {
    onValidityChange(!!selectedElement);
  }, [selectedElement, onValidityChange]);

  // Handle click outside dropdown nya langsung nutup
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleElementSelect = useCallback((element) => {
    setSelectedElement(element);
    setSearchQuery('');
    setIsDropdownOpen(false);
    onElementSelect(element);
  }, [setSelectedElement, setSearchQuery, setIsDropdownOpen, onElementSelect]);

  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  }, [setSearchQuery, setIsDropdownOpen]);

  const handleInputFocus = useCallback(() => {
    setIsDropdownOpen(true);
  }, []);

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
      <div className="flex h-full">
        <input
          type="text"
          placeholder={selectedElement || "Search target element..."}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={`w-full h-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9a61f] ${
            selectedElement 
              ? 'text-white bg-[#390028] border-2 border-[#f9a61f]' 
              : 'text-white bg-[#390028] border-[#c426a4] bg-opacity-50'
          }`}
        />
        {selectedElement && (
          <button
            onClick={() => {
              setSelectedElement('');
              onElementSelect('');
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {isDropdownOpen && filteredElements.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-[#390028] border-2 border-[#f9a61f] rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredElements.map((element) => (
            <div
              key={element}
              className="px-4 py-2 cursor-pointer hover:bg-[#c426a4] text-white"
              onClick={() => handleElementSelect(element)}
            >
              {element}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}