'use client';

export default function GoButton({ onClick, isEnabled, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={!isEnabled || isLoading}
      className={`w-full h-full flex items-center justify-center rounded-md transition-all duration-200 focus:outline-none
        ${isEnabled && !isLoading
          ? 'bg-[#c426a4] hover:bg-[#f9a61f] text-white cursor-pointer'
          : 'bg-[#390028] text-purple-300 bg-opacity-50 cursor-not-allowed'
        }
      `}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
      ) : (
        <span className="text-xl font-bold">GO</span>
      )}
    </button>
  );
}