import React from 'react';

const Input = ({ label, id, type = 'text', error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-medium text-[#321B16]">{label}</label>}
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-2.5 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl text-[#321B16] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B7A48] focus:border-transparent transition-all`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;