import type {
  Store,
  CreateSliceOptions,
  Slice,
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
  Middleware,
  ValidateSliceCaseReducers,
  ReducersMapObject,
  ReducerCreators
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

export type SliceReducers = ValidateSliceCaseReducers<any, any> | ((creators: ReducerCreators<any>) => any);
