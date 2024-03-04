import { StoreSlice } from './store';

export interface BlockFilterSlice {
  blockFilter: 'All' | 'user' | 'assistant' | 'system';
  setBlockFilter: (filter: BlockFilterSlice['blockFilter']) => void;
}

export const createBlockFilterSlice: StoreSlice<BlockFilterSlice> = (set) => ({
  blockFilter: 'All', // Default value
  setBlockFilter: (blockFilter) => set(() => ({ blockFilter })),
});
