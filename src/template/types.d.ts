import type { Middleware } from 'redux';
import type {
  CreateSliceOptions,
  Slice,
  SliceCaseReducers,
  DeepPartial,
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
  MiddlewareArray,
  ValidateSliceCaseReducers
} from '@reduxjs/toolkit';
import type { ThunkMiddlewareFor } from '@reduxjs/toolkit/src/getDefaultMiddleware';

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

export interface GetDefaultMiddlewareOptions {
  immutableCheck?: ImmutableStateInvariantMiddlewareOptions;
  serializableCheck?: SerializableStateInvariantMiddlewareOptions;
}

export type MiddlewareCbReturn = MiddlewareArray<
  Middleware<{}, any>
  | ThunkMiddlewareFor<any, GetDefaultMiddlewareOptions>
>;

export type SliceReducers = ValidateSliceCaseReducers<any, SliceCaseReducers<any>>;
