import type { IApi } from 'umi';
import { IgnoreOptions } from '../template/types';

/* 插件注册名称 */
export const pluginName: string = 'reduxToolkit';

/* 获取插件配置 */
export interface PluginConfig {
  ignoreOptions?: IgnoreOptions;
  singular?: boolean;
  modelName?: string;
  esModule?: boolean;
  ignore?: string | ReadonlyArray<string>;
  asyncLoadReducers?: boolean;
}

export function getConfig(api: IApi): PluginConfig | undefined {
  return api?.config?.[pluginName];
}