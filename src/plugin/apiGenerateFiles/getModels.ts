import { promisify } from 'util';
import * as path from 'path';
import { glob } from '@umijs/utils';
import type { IApi } from 'umi';
import type { IOptions } from 'glob';
import { getConfig, type PluginConfig } from '../utils';

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
  const files: Array<string> = await globPromise(pattern ?? '**/*.{ts,tsx,js,jsx,mjs,cjs}', {
    cwd,
    ignore: config?.ignore
  });

  return files.filter((file: string): boolean => {
    return !(
      /\.d\.tsx?$/i.test(file) // 忽略类型文件
      || /\.(tests?|async)\.(jsx?|tsx?|mjs|cjs)$/i.test(file) // test为测试文件，async为异步加载的文件
    );
  }).map((file: string): string => path.join(cwd, file).replace(/\\/g, '/'));
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

  return Array.from(
    new Set<string>([
      ...await getModels(api, srcModelsPath),
      ...await getModels(api, api.paths.absPagesPath!, `**/${ getModelDir(api) }/**/*.{ts,tsx,js,jsx,mjs,cjs}`)
    ])
  );
}