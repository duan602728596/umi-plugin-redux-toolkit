import {
  configureStore,
  combineReducers,
  ReducersMapObject,
  Reducer,
  Store,
  ConfigureStoreOptions,
  Middleware
} from '@reduxjs/toolkit';
import type { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/src/getDefaultMiddleware';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { ignoreOptions, sliceOptions } from './options.ts';
import { mergeIgnoreOptions, toReducers, getRTKQueryMiddlewareSet } from './helpers';
import type {
  IgnoreOptions,
  SliceOptionsItem,
  RuntimeReduxToolkit,
  GetDefaultMiddlewareOptions,
  MiddlewareCbReturn
} from './types';

/* 创建reducer */
const processedReducers: ReducersMapObject = toReducers(sliceOptions); // 已经格式化完毕的reducers配置
const reducer: Reducer = combineReducers(processedReducers);
const RTKQueryMiddlewareSet: Set<Middleware> = getRTKQueryMiddlewareSet(sliceOptions); // RTKQuery的中间件

/* store */
export let store: Store;

function createStore(runtimeReduxToolkit: RuntimeReduxToolkit = {}): void {
  const {
    initialState,                      // 初始化的state
    ignoreOptions: otherIgnoreOptions, // 忽略检查的action和paths
    warnAfter,                         // 检查时间超过Nms，则打印警告
    reducers: customReducers,          // 后添加的reducer
    middlewares: customMiddlewares,    // 添加自定义中间件
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
    let allMiddlewares: MiddlewareCbReturn
      = getDefaultMiddleware<GetDefaultMiddlewareOptions>(defaultMiddlewareOptions);

    // 添加RTK的中间件
    if (RTKQueryMiddlewareSet.size > 0) {
      allMiddlewares = allMiddlewares.concat(Array.from<Middleware>(RTKQueryMiddlewareSet));
    }

    // 添加自定义的中间件
    if (Array.isArray(customMiddlewares) && customMiddlewares.length > 0) {
      allMiddlewares = allMiddlewares.concat(customMiddlewares);
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

/**
 * 创建并返回store
 * @param { RuntimeReduxToolkit } runtimeReduxToolkit: 初始化的值
 * @return { Store }
 */
export function storeFactory(runtimeReduxToolkit: RuntimeReduxToolkit = {}): Store {
  if (!store) {
    createStore(runtimeReduxToolkit);
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