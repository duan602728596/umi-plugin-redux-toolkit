import { createSlice, Slice, ReducersMapObject, CreateSliceOptions, ValidateSliceCaseReducers } from '@reduxjs/toolkit';
import type { IgnoreOptions, sliceOptionsItem } from './types';

/* 合并ignore选项 */
export function mergeIgnoreOptions(...ignoreOptions: Array<IgnoreOptions | undefined>): IgnoreOptions {
  const ignore: IgnoreOptions = {};

  const merge: (k: string, o: Array<string>) => void = (k: string, o: Array<string>): void => {
    if (!(k in ignore)) {
      ignore[k] = [];
    }

    ignore[k].push(...o);
  };

  for (const item of ignoreOptions) {
    if (item /* IgnoreOptions | undefined */) {
      for (const key in item) {
        if (item[key]?.length) {
          merge(key, item[key] /* Array<string> */);
        }
      }
    }
  }

  return ignore;
}

/* 判断是否是slice */
export function isSlice(slice: sliceOptionsItem): slice is Slice {
  return ('actions' in slice) && ('reducer' in slice);
}

/* 格式化reducers */
export function formatReducers(reducers: ValidateSliceCaseReducers<any, any>, regexp: RegExp): ValidateSliceCaseReducers<any, any> {
  const newReducers: ValidateSliceCaseReducers<any, any> = {};

  for (const key in reducers) {
    const newKey: string = regexp.test(key) ? key.replace(regexp, '') : key;

    newReducers[newKey] = reducers[key];
  }

  return newReducers;
}

/* 创建reducers */
export function toReducers(sliceOptions: Array<sliceOptionsItem> = []): ReducersMapObject {
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