import React from 'react';

const OutlinedButton = ({ children, onClick, isSelected }) => {
  const buttonStyles = isSelected
    ? "border-primary-500"
    : "text-card-foreground border-slate-600 hover:border-primary-500";
  return (
    <button
    className={`${buttonStyles} rounded-full border-2 px-6 py-3 text-xl cursor-pointer`}
    onClick={onClick}
    >
      {children}
    </button>
  );

}
export default OutlinedButton;