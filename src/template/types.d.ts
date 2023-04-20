import type {
  Store,
  CreateSliceOptions,
  Slice,
  SliceCaseReducers,
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
  Middleware,
  ValidateSliceCaseReducers,
  ReducersMapObject
} from '@reduxjs/toolkit';
import type { Api, BaseQueryFn, EndpointDefinitions } from '@reduxjs/toolkit/query';

export interface IgnoreOptions {
  ignoredPaths?: Array<string>;
  ignoredActions?: Array<string>;
}

export type QueryApi = Api<BaseQueryFn, EndpointDefinitions, string, string>;
export type SliceOptionsItem = CreateSliceOptions | Slice | QueryApi;

export interface RuntimeReduxToolkit<T = any> {
  initialState?: any | (() => any);
  ignoreOptions?: IgnoreOptions;
  warnAfter?: number;
  reducers?: ReducersMapObject;
  middlewares?: Array<Middleware>;
  treatStore?(store: Store): void;
}

export type RuntimeReduxToolkitApply = RuntimeReduxToolkit | (() => RuntimeReduxToolkit);

export interface GetDefaultMiddlewareOptions {
  immutableCheck?: ImmutableStateInvariantMiddlewareOptions;
  serializableCheck?: SerializableStateInvariantMiddlewareOptions;
}

export type Middlewares = ReadonlyArray<Middleware>;

export type SliceReducers = ValidateSliceCaseReducers<any, SliceCaseReducers<any>>;
