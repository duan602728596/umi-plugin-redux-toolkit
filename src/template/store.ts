import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
  createSlice,
  ReducersMapObject,
  Reducer,
  Store,
  DeepPartial,
  ConfigureStoreOptions,
  Slice,
  CreateSliceOptions,
  ValidateSliceCaseReducers
} from '@reduxjs/toolkit';
// @ts-ignore
import { ignoreOptions, sliceOptions, IgnoreOptions } from './options';

/* 创建reducer */
export function createReducer(reducers: ReducersMapObject): Reducer {
  return combineReducers({
    ...reducers
  });
}

/* 创建slice，合并成ReducersMap */
function sliceOptionsToReducer(sliceOptions: Array<CreateSliceOptions>): ReducersMapObject {
  const result: ReducersMapObject = {};

  for (const item of sliceOptions) {
    if (item) {
      const options: CreateSliceOptions = { ...item };
      const regexp: RegExp = new RegExp(`^${ item.name }/`); // 命名空间的判断

      // reduces的key不需要带命名空间，所以需要处理一下，将通过createAction创建的reduces的key处理一下，删除掉命名空间
      if (options.reducers) {
        const newReducers: ValidateSliceCaseReducers<any, any> = {};

        for (const key in options.reducers) {
          const newKey: string = regexp.test(key) ? key.replace(regexp, '') : key;

          newReducers[newKey] = options.reducers[key];
        }

        options.reducers = newReducers;
      }

      const slice: Slice = createSlice(options);

      result[item.name] = slice.reducer;
    }
  }

  return result;
}

/* 合并ignore */
function mergeIgnore(ignoreOptions?: IgnoreOptions, otherIgnoreOptions?: IgnoreOptions): IgnoreOptions {
  const ignore: IgnoreOptions = {};

  if (ignoreOptions?.ignoredPaths) {
    ignore.ignoredPaths = [...ignoreOptions.ignoredPaths];
  }

  if (otherIgnoreOptions?.ignoredPaths) {
    ignore.ignoredPaths = [...(ignore.ignoredPaths ?? []), ...otherIgnoreOptions.ignoredPaths];
  }

  if (ignoreOptions?.ignoredActions) {
    ignore.ignoredActions = [...ignoreOptions.ignoredActions];
  }

  if (otherIgnoreOptions?.ignoredActions) {
    ignore.ignoredActions = [...(ignore.ignoredActions ?? []), ...otherIgnoreOptions.ignoredActions];
  }

  return ignore;
}

/* reducer列表 */
const reducer: Reducer = createReducer(sliceOptionsToReducer(sliceOptions));

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
    const ignore: IgnoreOptions = mergeIgnore(ignoreOptions, otherIgnoreOptions);

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