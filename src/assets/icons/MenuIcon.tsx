import React from 'react';

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      stroke='white'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      strokeLinecap='round'
      strokeLinejoin='round'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <line x1='5' y1='12' x2='19' y2='12'></line>
      <line x1='5' y1='6' x2='19' y2='6'></line>
      <line x1='5' y1='18' x2='19' y2='18'></line>
    </svg>
  );
};

export default MenuIcon;
