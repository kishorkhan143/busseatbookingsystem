import React from 'react';

export const Currency: React.FC<{ amount: number | string; className?: string }> = ({
  amount,
  className = '',
}) => {
  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span className="text-[0.9em] mr-0.5 font-bold">₹</span>
      <span>{amount}</span>
    </span>
  );
};
