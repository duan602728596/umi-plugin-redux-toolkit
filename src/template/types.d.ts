import type { Middleware } from 'redux';
import type {
  Store,
  CreateSliceOptions,
  Slice,
  SliceCaseReducers,
  DeepPartial,
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
  MiddlewareArray,
  ValidateSliceCaseReducers,
  Middlewares,
  ReducersMapObject
} from '@reduxjs/toolkit';
import type { ThunkMiddlewareFor } from '@reduxjs/toolkit/src/getDefaultMiddleware';
import type { Api } from '@reduxjs/toolkit/query';

export interface IgnoreOptions {
  ignoredPaths?: Array<string>;
  ignoredActions?: Array<string>;
}

export type SliceOptionsItem = CreateSliceOptions | Slice | Api;

export interface RuntimeReduxToolkit<T = any> {
  initialState?: DeepPartial<T> | (() => DeepPartial<T>);
  ignoreOptions?: IgnoreOptions;
  warnAfter?: number;
  reducers?: ReducersMapObject;
  middlewares?: Array<Middlewares>;
  treatStore?(store: Store): void;
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
