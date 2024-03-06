import React, { useEffect, useRef, useState } from 'react';

import useStore from '@store/store';

import NewChat from './NewChat';
import NewFolder from './NewFolder';
import ChatHistoryList from './ChatHistoryList';
import MenuOptions from './MenuOptions';

import CrossIcon2 from '@icon/CrossIcon2';
import DownArrow from '@icon/DownArrow';
import MenuIcon from '@icon/MenuIcon';

const Menu = () => {
  const hideSideMenu = useStore((state) => state.hideSideMenu);
  const setHideSideMenu = useStore((state) => state.setHideSideMenu);
  const [menuWidth, setMenuWidth] = useState(260); // Default width
  const ref = useRef<HTMLDivElement>(null);

  const minimumWidth = 260; // Minimum width before hiding the menu
  const hideMenuWidthThreshold = 80; // Threshold to decide when to hide the menu

  useEffect(() => {
    if (window.innerWidth < 768) setHideSideMenu(true);
    const handleResize = () => {
      if (window.innerWidth < 768) setHideSideMenu(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setHideSideMenu]);

  const startResizing = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    mouseDownEvent.preventDefault();
    const startX = mouseDownEvent.pageX;
    const startWidth = ref.current?.offsetWidth || 0;
  
    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = startWidth + mouseMoveEvent.pageX - startX;
      if (newWidth > minimumWidth) {
        setMenuWidth(newWidth);
      } else if (newWidth <= hideMenuWidthThreshold) {
        // Hide the menu if dragged beyond the threshold
        setHideSideMenu(true);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      } else {
        // Prevent the menu from being resized below the minimum width
        setMenuWidth(minimumWidth);
      }
    };
  
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      <div
        ref={ref}
        id='menu'
        className={`group/menu dark new-menu-dark fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col transition-transform z-[999] top-0 left-0 h-full max-md:w-3/4 ${
          hideSideMenu ? 'translate-x-[-100%]' : 'translate-x-[0%]'
        }`}
        style={{ width: menuWidth }}
      >
        <div className='flex h-full min-h-0 flex-col'>
          <div className='flex h-full w-full flex-1 items-start border-white/20'>
            <nav className='flex h-full flex-1 flex-col space-y-1 px-2 pt-2'>
              <div className='flex gap-2'>
                <NewChat />
                <NewFolder />
              </div>
              <ChatHistoryList />
              <MenuOptions />
            </nav>
          </div>
        </div>
        <div
          className="resize-handle cursor-ew-resize absolute top-0 right-0 h-full w-2"
          onMouseDown={startResizing}
        >
        </div>
        <div
          id='menu-close'
          className={`${
            hideSideMenu ? 'hidden' : ''
          } md:hidden absolute z-[999] right-0 translate-x-full top-10 bg-black p-2 cursor-pointer hover:bg-black text-white`}
          onClick={() => {
            setHideSideMenu(true);
          }}
        >
          <CrossIcon2 />
        </div>
        <div
          className={`${
            hideSideMenu ? 'opacity-100' : 'opacity-0'
          } group/menu md:group-hover/menu:opacity-100 max-md:hidden transition-opacity absolute z-[999] right-0 translate-x-full top-10 new-menu-dark p-1 cursor-pointer hover:new-lightblue text-white rounded-2xl border border-white/20 ${
            hideSideMenu ? '' : 'rotate-90'
          }`}
          onClick={() => {
            setHideSideMenu(!hideSideMenu);
          }}
        >
          {hideSideMenu ? (
            <MenuIcon className='h-6 w-6' />
          ) : (
            <DownArrow className='h-4 w-4' />
          )}
        </div>
      </div>
      <div
        id='menu-backdrop'
        className={`${
          hideSideMenu ? 'hidden' : ''
        } md:hidden fixed top-0 left-0 h-full w-full z-[60] bg-gray-900/70`}
        onClick={() => {
          setHideSideMenu(true);
        }}
      />
    </>
  );
};

export default Menu;
