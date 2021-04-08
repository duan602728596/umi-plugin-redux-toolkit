import { promisify } from 'util';
import * as path from 'path';
import { utils, IApi } from 'umi';
import type { IOptions } from 'glob';
import { getConfig, PluginConfig } from './utils';

const { lodash: _, glob }: typeof utils = utils;
const globPromise: (pattern: string, options?: IOptions) => Promise<Array<string>> = promisify(glob);

/**
 * 获取redux的目录名称
 * @param { IApi } api: umi api方法
 * @return { string }
 */
export function getModelDir(api: IApi): string {
  const config: PluginConfig | undefined = getConfig(api);

  if (config?.modelName) {
    return config?.modelName;
  }

  return config?.singular ? 'model' : 'models';
}

/**
 * 获取models
 * @param { IApi } api
 * @param { string } cwd: 目录
 * @param { string | undefined } pattern
 * @return { Promise<Array<string>> }
 */
export async function getModels(api: IApi, cwd: string, pattern?: string): Promise<Array<string>> {
  const config: PluginConfig | undefined = getConfig(api);
  const files: Array<string> = await globPromise(pattern ?? '**/*.{ts,tsx,js,jsx}', {
    cwd,
    ignore: config?.ignore
  });

  return files.filter((file: string): boolean => {
    return !file.endsWith('.d.ts')
      && !file.endsWith('.test.js')
      && !file.endsWith('.test.jsx')
      && !file.endsWith('.test.ts')
      && !file.endsWith('.test.tsx')
      && !file.endsWith('.async.js')
      && !file.endsWith('.async.jsx')
      && !file.endsWith('.async.ts')
      && !file.endsWith('.async.tsx');
  }).map((file: string): string => path.join(cwd, file));
}

/**
 * 获取redux的目录
 * @param { IApi } api: umi api方法
 * @return { string }
 */
export function getModelsPath(api: IApi): string {
  return path.join(api.paths.absSrcPath!, getModelDir(api));
}

/**
 * 获取所有的redux文件
 * @param { object } api: umi api方法
 */
export async function getAllModels(api: IApi): Promise<Array<string>> {
  const srcModelsPath: string = getModelsPath(api);

  return _.uniq([
    ...await getModels(api, srcModelsPath),
    ...await getModels(api, api.paths.absPagesPath!, `**/${ getModelDir(api) }/**/*.{ts,tsx,js,jsx}`)
  ]);
}