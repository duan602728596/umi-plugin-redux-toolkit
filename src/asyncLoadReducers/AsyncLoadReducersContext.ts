import { createContext, Context } from 'react';
import type { SliceOptionsItem } from '../template/types';

export interface AsyncLoadReducersContextType {
  replaceReducers?(asyncSliceOptions: Array<SliceOptionsItem>): void;
}

const AsyncLoadReducersContext: Context<AsyncLoadReducersContextType> = createContext({});

export default AsyncLoadReducersContext;