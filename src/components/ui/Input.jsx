import React from 'react';

export function Input({ label, type = 'text', required, value, onChange, rows, ...props }) {
  const inputClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          rows={rows}
          required={required}
          className={inputClass}
          value={value}
          onChange={onChange}
          {...props}
        />
      ) : (
        <input
          type={type}
          required={required}
          className={inputClass}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}
    </div>
  );
}