import React from 'react';

export function Input({ label, value, onChange, required, type = "text", rows, ...rest }) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 font-medium">{label}</label>}
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className="border rounded p-2 focus:outline-none focus:ring"
          {...rest}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className="border rounded p-2 focus:outline-none focus:ring"
          {...rest}
        />
      )}
    </div>
  );
}

export function LoadingSpinner({ className }) {
  return (
    <div className={className}>
      <svg className="animate-spin" viewBox="0 0 50 50">
        <circle
          className="opacity-25"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M25 5a20 20 0 0 1 0 40 20 20 0 0 1 0-40z"
        />
      </svg>
    </div>
  );
}