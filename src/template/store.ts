import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
  ReducersMapObject,
  Reducer,
  Store,
  ConfigureStoreOptions
} from '@reduxjs/toolkit';
// @ts-ignore
import { ignoreOptions, sliceOptions } from './options';
import { mergeIgnoreOptions, toReducers } from './utils';
import type { IgnoreOptions, RuntimeReduxToolkit } from './types';

/* 创建reducer */
export function createReducer(reducers: ReducersMapObject): Reducer {
  return combineReducers({
    ...reducers
  });
}

/* reducer列表 */
const reducer: Reducer = createReducer(toReducers(sliceOptions));

/* store */
export let store: Store;

/**
 * 创建并返回store
 * @param { RuntimeReduxToolkit } runtimeReduxToolkit: 初始化的值
 */
export function storeFactory(runtimeReduxToolkit: RuntimeReduxToolkit = {}): Store {
  if (!store) {
    const { initialState, ignoreOptions: otherIgnoreOptions, warnAfter }: RuntimeReduxToolkit = runtimeReduxToolkit;

    // store的配置
    const options: ConfigureStoreOptions = {
      reducer,
      preloadedState: initialState
    };
    const ignore: IgnoreOptions = mergeIgnoreOptions(ignoreOptions, otherIgnoreOptions); // 配置忽略检查的action和paths
    const defaultMiddlewareOptions: { [key: string]: any } = {                           // getDefaultMiddleware的配置
      immutableCheck: Object.assign({
        warnAfter: warnAfter ?? 800 // See https://redux-toolkit.js.org/api/immutabilityMiddleware#options
      }, ignore),
      serializableCheck: Object.assign({
        warnAfter: warnAfter ?? 800 // See https://redux-toolkit.js.org/api/serializabilityMiddleware#options
      }, ignore)
    };

    options.middleware = getDefaultMiddleware(defaultMiddlewareOptions);

    /* 合并store */
    store = configureStore(options);
  }

  return store;
}

/* replace reducers */
export function replaceReducers(reducers: ReducersMapObject): void {
  store.replaceReducer(createReducer(reducers));
}