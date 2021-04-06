import {
  createSlice,
  Slice,
  ReducersMapObject,
  CreateSliceOptions,
  ValidateSliceCaseReducers as VSCR
} from '@reduxjs/toolkit';
import type { IgnoreOptions, SliceOptionsItem } from './types';

/* 合并ignore选项 */
export function mergeIgnoreOptions(...ignoreOptions: Array<IgnoreOptions | undefined>): IgnoreOptions {
  const ignore: IgnoreOptions = {};

  /**
   * 合并函数
   * @param { string } k: 要合并的key
   * @param { Array<string> } o: key对应的值
   */
  const merge: (k: string, o: Array<string>) => void = (k: string, o: Array<string>): void => {
    if (!(k in ignore)) {
      ignore[k] = [];
    }

    ignore[k].push(...o);
  };

  // 合并
  const filterIgnoreOptions: Array<IgnoreOptions> = ignoreOptions
    .filter<IgnoreOptions>((o: IgnoreOptions | undefined): o is IgnoreOptions => !o);

  for (const item of filterIgnoreOptions) {
    for (const key in item) {
      item[key]?.length && merge(key, item[key]);
    }
  }

  return ignore;
}

/* 判断是否是slice */
export function isSlice(slice: SliceOptionsItem): slice is Slice {
  return ('actions' in slice) && ('reducer' in slice);
}

/* 格式化reducers */
export function formatReducers(reducers: VSCR<any, any>, regexp: RegExp): VSCR<any, any> {
  const newReducers: VSCR<any, any> = {};

  for (const key in reducers) {
    const newKey: string = regexp.test(key) ? key.replace(regexp, '') : key;

    newReducers[newKey] = reducers[key];
  }

  return newReducers;
}

/* 创建reducers */
export function toReducers(sliceOptions: Array<SliceOptionsItem> = []): ReducersMapObject {
  const result: ReducersMapObject = {};

  for (const item of sliceOptions) {
    if (!item) {
      continue;
    }

    if (isSlice(item)) {
      result[item.name] = item.reducer;
    } else if (item.name) {
      const options: CreateSliceOptions = { ...item };               // 创建slice的配置
      const regexp: RegExp = new RegExp(`^${ item.name }/`); // 命名空间的判断

      // reduces的key不需要带命名空间，所以需要处理一下，将通过createAction创建的reduces的key处理一下，删除掉命名空间
      if (options.reducers) {
        options.reducers = formatReducers(options.reducers, regexp);
      }

      const slice: Slice = createSlice(options);

      result[slice.name] = slice.reducer;
    }
  }

  return result;
}