import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
  ReducersMapObject,
  Reducer,
  Store,
  DeepPartial,
  ConfigureStoreOptions
} from '@reduxjs/toolkit';
// @ts-ignore
import { ignoreOptions, sliceOptions } from './options';
import { mergeIgnoreOptions, toReducers } from './utils';
import type { IgnoreOptions } from './types';

/* 创建reducer */
export function createReducer(reducers: ReducersMapObject): Reducer {
  return combineReducers({
    ...reducers
  });
}

/* reducer列表 */
const reducer: Reducer = createReducer(toReducers(sliceOptions));

/* store */
const store: Store = {} as Store;

/**
 * 创建并返回store
 * @param { DeepPartial<any> } initialState: 初始化的state
 * @param { IgnoreOptions } otherIgnoreOptions: 忽略检查的action和paths
 */
export function storeFactory(initialState: DeepPartial<any> = {}, otherIgnoreOptions?: IgnoreOptions): Store {
  if (Object.keys(store).length === 0) {
    // 创建store的配置
    const options: ConfigureStoreOptions = {
      reducer,
      preloadedState: initialState
    };

    // 配置忽略检查的action和paths
    const ignore: IgnoreOptions = mergeIgnoreOptions(ignoreOptions, otherIgnoreOptions);

    // 创建defaultMiddleware
    if (Object.keys(ignore).length > 0) {
      options.middleware = getDefaultMiddleware({
        immutableCheck: ignore,
        serializableCheck: ignore
      });
    }

    /* 合并store */
    Object.assign(store, configureStore(options));
  }

  return store;
}

export default store;

/* replace reducers */
export function replaceReducers(reducers: ReducersMapObject): void {
  store.replaceReducer(createReducer(reducers));
}