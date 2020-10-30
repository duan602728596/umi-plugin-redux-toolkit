import { CreateSliceOptions } from '@reduxjs/toolkit';

export interface IgnoreOptions {
  ignoredPaths?: Array<string>;
  ignoredActions?: Array<string>;
}

// [template]
// export const ignoreOptions: IgnoreOptions = {};
// export const sliceOptions: Array<CreateSliceOptions> = [];