import React from 'react';

const PersonIcon = ({ color = 'currentColor' }) => {
  return (
    <svg
      stroke={color}
      fill='#75B4D4'
      strokeWidth='2'
      viewBox='0 0 24 24'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-8 w-8'
      height='1em'
      width='1em'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
      <circle cx='12' cy='7' r='4'></circle>
    </svg>
  );
};

export default PersonIcon;
