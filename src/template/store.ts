import {
  configureStore,
  combineReducers,
  ReducersMapObject,
  Reducer,
  Store,
  ConfigureStoreOptions
} from '@reduxjs/toolkit';
import type { Middleware } from 'redux';
import type { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/src/getDefaultMiddleware';
// @ts-ignore
import { ignoreOptions, sliceOptions, SliceOptionsItem } from './options';
import { mergeIgnoreOptions, toReducers, getRTKQueryMiddlewareSet } from './utils';
import type { IgnoreOptions, RuntimeReduxToolkit, GetDefaultMiddlewareOptions, MiddlewareCbReturn } from './types';

/* 创建reducer */
const processedReducers: ReducersMapObject = toReducers(sliceOptions); // 已经格式化完毕的reducers配置
const reducer: Reducer = combineReducers(processedReducers);
const RTKQueryMiddlewareSet: Set<Middleware> = getRTKQueryMiddlewareSet(sliceOptions); // RTKQuery的中间件

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
      warnAfter,                         // 检查时间超过Nms，则打印警告
      reducers: customReducers,          // 后添加的reducer
      middlewares,                       // 添加自定义中间件
      treatStore                         // 对store的处理
    }: RuntimeReduxToolkit = runtimeReduxToolkit;

    // store的配置
    const options: ConfigureStoreOptions = {
      reducer,
      preloadedState: typeof initialState === 'function' ? initialState() : initialState
    };

    // 配置忽略检查的action和paths
    const ignore: IgnoreOptions = mergeIgnoreOptions(ignoreOptions, otherIgnoreOptions);

    // getDefaultMiddleware的配置
    const defaultMiddlewareOptions: GetDefaultMiddlewareOptions = {
      immutableCheck: Object.assign({
        warnAfter: warnAfter ?? 800 // See https://redux-toolkit.js.org/api/immutabilityMiddleware#options
      }, ignore),
      serializableCheck: Object.assign({
        warnAfter: warnAfter ?? 800 // See https://redux-toolkit.js.org/api/serializabilityMiddleware#options
      }, ignore)
    };

    // 中间件
    options.middleware = function(getDefaultMiddleware: CurriedGetDefaultMiddleware): MiddlewareCbReturn {
      const allMiddlewares: MiddlewareCbReturn
        = getDefaultMiddleware<GetDefaultMiddlewareOptions>(defaultMiddlewareOptions);

      // 添加rtk的中间件
      if (RTKQueryMiddlewareSet.size > 0) {
        RTKQueryMiddlewareSet.forEach((m: Middleware): unknown => allMiddlewares.push(m));
      }

      // 添加自定义的中间件
      if (Array.isArray(middlewares) && middlewares.length > 0) {
        allMiddlewares.push(...middlewares);
      }

      return allMiddlewares;
    };

    /* 合并store */
    store = configureStore(options);

    /* 添加自定义的reducer */
    if (customReducers) {
      Object.assign(processedReducers, customReducers);
      store.replaceReducer(combineReducers(processedReducers));
    }

    /* 对store进行处理 */
    treatStore && treatStore(store);
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