import { createContext, type Context } from 'react';
import type { SliceOptionsItem } from '../template/types';

export interface DynamicReducersContextType {
  replaceReducers?(asyncSliceOptions: Array<SliceOptionsItem>): void;
}

const DynamicReducersContext: Context<DynamicReducersContextType> = createContext({});

export default DynamicReducersContext;