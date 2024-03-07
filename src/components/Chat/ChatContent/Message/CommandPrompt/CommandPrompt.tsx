import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';
import { matchSorter } from 'match-sorter';
import { Prompt } from '@type/prompt';
import PromptLibraryIcon from '@icon/PromptLibraryIcon';
import ConfigMenu from '@components/ConfigMenu';
import { ChatInterface, ConfigInterface } from '@type/chat';
import { _defaultChatConfig } from '@constants/chat';
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';

const CommandPrompt = ({
  _setContent,
}: {
  _setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const prompts = useStore((state) => state.prompts);
  const [_prompts, _setPrompts] = useState<Prompt[]>(prompts);
  const [input, setInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  const { t } = useTranslation('model');
  const config = useStore(
    (state) =>
      state.chats &&
      state.chats.length > 0 &&
      state.currentChatIndex >= 0 &&
      state.currentChatIndex < state.chats.length
        ? state.chats[state.currentChatIndex].config
        : undefined,
    shallow
  );
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const setConfig = (config: ConfigInterface) => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    updatedChats[currentChatIndex].config = config;
    setChats(updatedChats);
  };

  useEffect(() => {
    const chats = useStore.getState().chats;
    if (chats && chats.length > 0 && currentChatIndex !== -1 && !config) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats[currentChatIndex].config = { ..._defaultChatConfig };
      setChats(updatedChats);
    }
  }, [currentChatIndex]);

  useEffect(() => {
    if (dropDown && inputRef.current) {
      // When dropdown is visible, focus the input
      inputRef.current.focus();
    }
  }, [dropDown]);

  useEffect(() => {
    const filteredPrompts = matchSorter(useStore.getState().prompts, input, {
      keys: ['name'],
    });
    _setPrompts(filteredPrompts);
  }, [input]);

  useEffect(() => {
    _setPrompts(prompts);
    setInput('');
  }, [prompts]);

  return config ? (
    <div className='relative max-wd-sm' ref={dropDownRef}>
      <div className="flex space-x-2">
        <button
          className='btn btn-neutral dark:new-btn dark:new-btn-neutral btn-small'
          aria-label='config-menu'
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {config.model}
        </button>
        {
          isModalOpen && (
            <ConfigMenu
              setIsModalOpen={setIsModalOpen}
              config={config}
              setConfig={setConfig}
            />
          )
        }
        <button
          className='btn btn-neutral dark:new-btn dark:new-btn-neutral btn-small'
          aria-label='prompt library'
          onClick={() => setDropDown(!dropDown)}
        >
          <PromptLibraryIcon/>
        </button>
      </div>
      <div
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 right-0 z-10 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:new-chat-lighter`}
      >
        <div className='text-sm px-4 py-2 w-max'>{t('promptLibrary')}</div>
        <input
          ref={inputRef}
          type='text'
          className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:new-chat-light-hover m-0 w-full mr-0 h-8 focus:outline-none'
          value={input}
          placeholder={t('search') as string}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <ul className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0 w-max max-w-sm max-md:max-w-[90vw] max-h-32 overflow-auto'>
          {_prompts.map((cp) => (
            <li
              className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer text-start w-full'
              onClick={() => {
                _setContent((prev) => prev + cp.prompt);
                setDropDown(false);
              }}
              key={cp.id}
            >
              {cp.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ): null;
};

export default CommandPrompt;
