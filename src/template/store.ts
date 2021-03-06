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
import { ignoreOptions, sliceOptions, SliceOptionsItem } from './options';
import { mergeIgnoreOptions, toReducers } from './utils';
import type { IgnoreOptions, RuntimeReduxToolkit } from './types';

/* 创建reducer */
const processedReducers: ReducersMapObject = toReducers(sliceOptions); // 已经格式化完毕的reducers配置
const reducer: Reducer = combineReducers(processedReducers);

/* store */
export let store: Store;

/**
 * 创建并返回store
 * @param { RuntimeReduxToolkit } runtimeReduxToolkit: 初始化的值
 * @return { Store }
 */
export function storeFactory(runtimeReduxToolkit: RuntimeReduxToolkit = {}): Store {
  if (!store) {
    const {
      initialState,                      // 初始化的state
      ignoreOptions: otherIgnoreOptions, // 忽略检查的action和paths
      warnAfter                          // 检查时间超过Nms，则打印警告
    }: RuntimeReduxToolkit = runtimeReduxToolkit;

    // store的配置
    const options: ConfigureStoreOptions = {
      reducer,
      preloadedState: typeof initialState === 'function' ? initialState() : initialState
    };

    // 配置忽略检查的action和paths
    const ignore: IgnoreOptions = mergeIgnoreOptions(ignoreOptions, otherIgnoreOptions);

    // getDefaultMiddleware的配置
    const defaultMiddlewareOptions: { [key: string]: any } = {
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

/**
 * 替换reducers
 * @param { Array<SliceOptionsItem> } asyncSliceOptions: 将要合并的slice配置
 */
export function replaceReducers(asyncSliceOptions: Array<SliceOptionsItem>): void {
  const asyncProcessedReducers: ReducersMapObject = toReducers(asyncSliceOptions); // 已经格式化完毕的，将要合并的reducers配置

  Object.assign(processedReducers, asyncProcessedReducers);
  store.replaceReducer(combineReducers(processedReducers));
}