import { createSlice, Slice, ReducersMapObject, CreateSliceOptions, Middleware } from '@reduxjs/toolkit';
import type { IgnoreOptions, QueryApi, SliceOptionsItem, SliceReducers } from './types';

/**
 * 合并函数
 * @param { IgnoreOptions } ignore
 * @param { string } key: 要合并的key
 * @param { Array<string> } optionsArr: key对应的值
 */
function _merge(ignore: IgnoreOptions, key: string, optionsArr: Array<string>): void {
  if (!(key in ignore)) {
    ignore[key] = [];
  }

  ignore[key].push(...optionsArr);
}

/**
 * 合并ignore选项
 * @param { Array<IgnoreOptions | undefined> } ignoreOptions: 合并ignoredPaths和ignoredActions
 * @return { IgnoreOptions }
 */
export function mergeIgnoreOptions(...ignoreOptions: Array<IgnoreOptions | undefined>): IgnoreOptions {
  const ignore: IgnoreOptions = {};

  // 合并
  const filterIgnoreOptions: Array<IgnoreOptions> = ignoreOptions
    .filter<IgnoreOptions>((o: IgnoreOptions | undefined): o is IgnoreOptions => o !== undefined && o !== null);

  for (const options of filterIgnoreOptions) {
    for (const key in options) {
      options[key]?.length && _merge(ignore, key, options[key]);
    }
  }

  return ignore;
}

/**
 * 判断是否是创建完的slice
 * @param { SliceOptionsItem } slice: 通过CreateSliceOption创建的slice或者为创建完的slice
 */
export function isSlice(slice: SliceOptionsItem): slice is Slice {
  return ('actions' in slice) && ('reducer' in slice);
}

/**
 * 判断是否是sliceOptions
 * @param { SliceOptionsItem } slice: 通过CreateSliceOption创建的slice或者为创建完的slice
 */
export function isCreateSliceOptions(slice: SliceOptionsItem): slice is CreateSliceOptions {
  return ('name' in slice) && !isSlice(slice);
}

/**
 * 判断是否是query api
 * @param { SliceOptionsItem } slice: 通过CreateSliceOption创建的slice或者为创建完的slice
 */
export function isQueryApi(slice: SliceOptionsItem): slice is QueryApi {
  return 'reducerPath' in slice;
}

/**
 * 判断是否是object
 * @param { any } value
 */
export function isObject(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 格式化reducers
 * @param { SliceReducers } reducers: 需要格式化的reduces
 * @param { RegExp } regexp: 命名空间的正则表达式
 */
export function formatReducers(reducers: SliceReducers, regexp: RegExp): SliceReducers {
  const newReducers: SliceReducers = {};

  for (const key in reducers) {
    const newKey: string = regexp.test(key) ? key.replace(regexp, '') : key;

    newReducers[newKey] = reducers[key];
  }

  return newReducers;
}

/**
 * 创建reducers
 * @param { Array<SliceOptionsItem> } sliceOptions: slice或者创建slice的配置，或者是一个RTKQuery创建的Api
 * @return { ReducersMapObject }
 */
export function toReducers(sliceOptions: Array<SliceOptionsItem> = []): ReducersMapObject {
  const reducersMap: ReducersMapObject = {};

  for (const item of sliceOptions) {
    if (!item) {
      continue;
    }

    if (isSlice(item)) {
      reducersMap[item.name] = item.reducer;
    } else if (isCreateSliceOptions(item)) {
      const options: CreateSliceOptions = { ...item };               // 创建slice的配置
      const regexp: RegExp = new RegExp(`^${ item.name }/`); // 命名空间的判断

      // reduces的key不需要带命名空间，所以需要处理一下。删除掉通过createAction创建的reduces的key的命名空间
      if (options.reducers) {
        options.reducers = formatReducers(options.reducers, regexp);
      }

      const slice: Slice = createSlice(options);

      reducersMap[slice.name] = slice.reducer;
    } else if (isQueryApi(item)) {
      reducersMap[item.reducerPath] = item.reducer;
    }
  }

  return reducersMap;
}

/**
 * 获取所有RTKQuery的middleware的Set
 * @param { Array<SliceOptionsItem> } sliceOptions: slice或者创建slice的配置
 * @return { Set<Middleware> }
 */
export function getMiddlewaresSet(sliceOptions: Array<SliceOptionsItem> = []): Set<Middleware> {
  const middlewareSet: Set<Middleware> = new Set();

  for (const item of sliceOptions) {
    // 添加中间件，中间件的来源可能是RTK Query或者listenerMiddleware
    if (item && isObject(item) && item?.['middleware'] && typeof item['middleware'] === 'function') {
      middlewareSet.add(item['middleware']);
    }
  }

  return middlewareSet;
}