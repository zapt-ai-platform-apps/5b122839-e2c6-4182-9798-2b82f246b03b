import React from 'react';

function Input({ label, type = 'text', rows, value, onChange, required }) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 mb-1">
        {label}
        {required && ' *'}
      </label>
      {type === 'textarea' ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          required={required}
          className="border border-gray-300 rounded-md p-2"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className="border border-gray-300 rounded-md p-2"
        />
      )}
    </div>
  );
}

export { Input };