import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';

import ChatFolder from './ChatFolder';
import ChatHistory from './ChatHistory';
import ChatSearch from './ChatSearch';

import {
  ChatHistoryInterface,
  ChatHistoryFolderInterface,
  ChatInterface,
  FolderCollection,
} from '@type/chat';

const ChatHistoryList = () => {
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);
  const setFolders = useStore((state) => state.setFolders);
  const chatTitles = useStore(
    (state) => state.chats?.map((chat) => chat.title),
    shallow
  );

  const [isHover, setIsHover] = useState<boolean>(false);
  const [chatFolders, setChatFolders] = useState<ChatHistoryFolderInterface>(
    {}
  );
  const [noChatFolders, setNoChatFolders] = useState<ChatHistoryInterface[]>(
    []
  );
  const [filter, setFilter] = useState<string>('');

  const chatsRef = useRef<ChatInterface[]>(useStore.getState().chats || []);
  const foldersRef = useRef<FolderCollection>(useStore.getState().folders);
  const filterRef = useRef<string>(filter);

  // Add a prop for the color filter
  const colorFilter = useStore((state) => state.colorFilter);

  // Displays chat folders and chat instances
  const updateFolders = () => {
    const _folders: ChatHistoryFolderInterface = {};
    const _noFolders: ChatHistoryInterface[] = [];
    const chats = useStore.getState().chats;
    const folders = useStore.getState().folders;
    let shouldExpandFolders: { [key: string]: boolean } = {};

    // New function to recursively add folders and their nested folders
    const addNestedFolders = (parentId: string | undefined, parentOrder: number) => {
      Object.values(folders)
        .filter((f) => f.parentFolderId === parentId)
        .sort((a, b) => a.order - b.order)
        .forEach((f) => {
          _folders[f.id] = [];
          addNestedFolders(f.id, f.order); // Recursive call to add any nested folders
        });
    };

    addNestedFolders(undefined, 0); // Start with root-level folders

    Object.values(folders)
      .sort((a, b) => a.order - b.order)
      .forEach((f) => (_folders[f.id] = []));

    if (chats) {
      chats.forEach((chat, index) => {
        const _filterLowerCase = filterRef.current.toLowerCase();
        const _chatTitle = chat.title.toLowerCase();
        const _chatFolderName = chat.folder ? folders[chat.folder].name.toLowerCase() : '';
  
        // Check if the chat should be skipped based on the filter and colorFilter
        const shouldSkip = (!_chatTitle.includes(_filterLowerCase) && !_chatFolderName.includes(_filterLowerCase)) ||
                            (colorFilter && chat.color !== colorFilter);
  
        if (shouldSkip) return true;
  
        if (!chat.folder) {
            _noFolders.push({
              title: chat.title, 
              index: index, 
              id: chat.id 
            });
          return true;
        }

        if (!_folders[chat.folder]) _folders[chat.folder] = [];

        _folders[chat.folder].push({
          title: chat.title,
          index: index,
          id: chat.id,
        });
        
        // Mark immediate folder for expansion if it contains a chat matching the filter
        shouldExpandFolders[chat.folder] = true;
      });
    }

    const updatedFolders = { ...folders };

    if (colorFilter) {
      // updates marked parent folders recursively until root with early exit
      const updateParentFolders = (folderId: string) => {
        let currentFolderId = folderId;
        while (
          updatedFolders[currentFolderId] &&
          updatedFolders[currentFolderId].parentFolderId
        ) {
          const parentFolderId = updatedFolders[currentFolderId].parentFolderId;
          if (parentFolderId) {
            updatedFolders[parentFolderId].expanded = true;
            currentFolderId = parentFolderId;
          }
        }
      };

      Object.keys(updatedFolders).forEach(folderId => {
        if (updatedFolders[folderId]) {
          updatedFolders[folderId].expanded = !!shouldExpandFolders[folderId];
          updateParentFolders(folderId);
        }
      });

      setFolders(updatedFolders); // Assuming setFolders updates the global state of folders
    }
  
    setChatFolders(_folders);
    setNoChatFolders(_noFolders);
  }

  // Call updateFolders in response to colorFilter changes
  useEffect(() => {
    updateFolders();
  }, [colorFilter]); // Dependency array ensures updateFolders is called when colorFilter changes

  useEffect(() => {
    updateFolders();

    useStore.subscribe((state) => {
      if (
        !state.generating &&
        state.chats &&
        state.chats !== chatsRef.current
      ) {
        updateFolders();
        chatsRef.current = state.chats;
      } else if (state.folders !== foldersRef.current) {
        updateFolders();
        foldersRef.current = state.folders;
      }
    });
  }, []);

  useEffect(() => {
    if (
      chatTitles &&
      currentChatIndex >= 0 &&
      currentChatIndex < chatTitles.length
    ) {
      // set title
      document.title = 'AiNotes'

      //set title of tab based on current chat title
      //document.title = chatTitles[currentChatIndex];

      // expand folder of current chat
      const chats = useStore.getState().chats;
      if (chats) {
        const folderId = chats[currentChatIndex].folder;

        if (folderId) {
          const updatedFolders: FolderCollection = JSON.parse(
            JSON.stringify(useStore.getState().folders)
          );

          updatedFolders[folderId].expanded = true;
          setFolders(updatedFolders);
        }
      }
    }
  }, [currentChatIndex, chatTitles]);

  useEffect(() => {
    filterRef.current = filter;
    updateFolders();
  }, [filter]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer) {
      e.stopPropagation();
      setIsHover(false);

      const chatIndex = Number(e.dataTransfer.getData('chatIndex'));
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      delete updatedChats[chatIndex].folder;
      setChats(updatedChats);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHover(true);
  };

  const handleDragLeave = () => {
    setIsHover(false);
  };

  const handleDragEnd = () => {
    setIsHover(false);
  };

  return (
    <div
      className={`flex-col flex-1 overflow-y-auto hide-scroll-bar border-b border-white/20 ${
        isHover ? 'bg-gray-800/40' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
    >
      <ChatSearch filter={filter} setFilter={setFilter} />
      <div className='flex flex-col gap-2 text-gray-100 text-sm'>
        {Object.entries(useStore.getState().folders)
          .map(([folderId, folder]) => (
            !folder?.parentFolderId && (
              <ChatFolder
                folderChats={chatFolders}
                folderId={folderId}
                key={folderId}
                childFolders={folder.childFolders || {}}
            />
            )
          )
        )}
        {noChatFolders.map(({ title, index, id }) => (
          <ChatHistory title={title} key={`${title}-${id}`} chatIndex={index} />
        ))}
      </div>
      <div className='w-full h-10' />
    </div>
  );
};

const ShowMoreButton = () => {
  return (
    <button className='btn relative btn-dark btn-small m-auto mb-2'>
      <div className='flex items-center justify-center gap-2'>Show more</div>
    </button>
  );
};

export default ChatHistoryList;
