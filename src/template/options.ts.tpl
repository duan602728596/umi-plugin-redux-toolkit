import type { IgnoreOptions, SliceOptionsItem } from './types';
{{{ importContent }}}

/**
 * 导出@reduxjs/toolkit的忽略
 * refer: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
 */
export const ignoreOptions: IgnoreOptions = {{{ ignoreOptions }}};

/**
 * slice或创建slice的配置
 * refer: https://redux-toolkit.js.org/api/createSlice
 */
export const sliceOptions: Array<SliceOptionsItem> = {{{ slice }}};