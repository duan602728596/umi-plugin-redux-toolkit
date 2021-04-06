import type { IgnoreOptions, SliceOptionsItem } from './types';

/**
 * 导出配置
 *
 * example:
 *   // 导出@reduxjs/toolkit的忽略
 *   // refer: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
 *   export const ignoreOptions: IgnoreOptions = {};
 *
 *   // slice或创建slice的配置
 *   // refer: https://redux-toolkit.js.org/api/createSlice
 *   export const sliceOptions: Array<SliceOptionsItem> = [];
 */