import React from 'react';

const CurrencySelector = ({ selectedCurrency, onChange }) => {
  const currencies = [
    { code: 'GBP', symbol: '£', name: 'British Pound', price: '4.00' },
    { code: 'EUR', symbol: '€', name: 'Euro', price: '4.50' },
    { code: 'USD', symbol: '$', name: 'US Dollar', price: '5.00' }
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Currency
      </label>
      <div className="flex flex-col space-y-3">
        {currencies.map((currency) => (
          <div
            key={currency.code}
            onClick={() => onChange(currency.code)}
            className={`
              border rounded-lg p-3 flex items-center justify-between
              cursor-pointer transition-colors
              ${selectedCurrency === currency.code 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                <span className="text-lg font-medium">{currency.symbol}</span>
              </div>
              <div>
                <p className="font-medium">{currency.code}</p>
                <p className="text-xs text-gray-500">{currency.name}</p>
              </div>
            </div>
            <span className="font-medium text-blue-600">
              {currency.symbol}{currency.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencySelector;