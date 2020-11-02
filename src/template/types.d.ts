import type { CreateSliceOptions, Slice } from '@reduxjs/toolkit';

export interface IgnoreOptions {
  ignoredPaths?: Array<string>;
  ignoredActions?: Array<string>;
}

export type sliceOptionsItem = CreateSliceOptions | Slice;