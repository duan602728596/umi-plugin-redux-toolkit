import type { CreateSliceOptions, Slice, DeepPartial } from '@reduxjs/toolkit';

export interface IgnoreOptions {
  ignoredPaths?: Array<string>;
  ignoredActions?: Array<string>;
}

export type SliceOptionsItem = CreateSliceOptions | Slice;

export interface RuntimeReduxToolkit {
  initialState?: DeepPartial<any> | (() => DeepPartial<any>);
  ignoreOptions?: IgnoreOptions;
  warnAfter?: number;
}

export type RuntimeReduxToolkitApply = RuntimeReduxToolkit | (() => RuntimeReduxToolkit);