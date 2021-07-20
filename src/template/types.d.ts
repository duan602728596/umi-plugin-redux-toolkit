import type { Middleware } from 'redux';
import type {
  CreateSliceOptions,
  Slice,
  DeepPartial,
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
  MiddlewareArray
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

// getDefaultMiddleware的类型，无法从@reduxjs/toolkit中导出
interface ThunkOptions<E = any> {
  extraArgument: E;
}

export interface GetDefaultMiddlewareOptions {
  thunk?: boolean | ThunkOptions;
  immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
  serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
}

export type MiddlewareCbReturn = MiddlewareArray<
  Middleware<{}, any>
  | ThunkMiddlewareFor<any, GetDefaultMiddlewareOptions>
>;