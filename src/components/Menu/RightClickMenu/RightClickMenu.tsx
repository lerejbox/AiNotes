import React, { useEffect } from 'react';

const RightClickMenu = ({
  x,
  y,
  onClose,
  options,
}: {
  x: number;
  y: number;
  onClose: () => void;
  options: { label: string; action: () => void }[];
}) => {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      onClose();
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [onClose]);

  return (
    <div
      className="absolute z-50 bg-gray-700 text-white rounded shadow"
      style={{ top: y, left: x }}
    >
      {options.map((option, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            option.action();
            onClose();
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default RightClickMenu;
