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
import type { NoInfer } from '@reduxjs/toolkit/src/tsHelpers';
import type { PreloadedState, CombinedState } from 'redux';
import type { Api, BaseQueryFn, EndpointDefinitions } from '@reduxjs/toolkit/query';

type InitialState<S = any> = PreloadedState<CombinedState<NoInfer<S>>>;

export interface IgnoreOptions {
  ignoredPaths?: Array<string>;
  ignoredActions?: Array<string>;
}

export type QueryApi = Api<BaseQueryFn, EndpointDefinitions, string, string>;
export type SliceOptionsItem = CreateSliceOptions | Slice | QueryApi;

export interface RuntimeReduxToolkit<T = any> {
  initialState?: InitialState<T> | (() => InitialState<T>);
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
