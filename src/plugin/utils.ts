import { promisify } from 'util';
import * as path from 'path';
import { utils, IApi } from 'umi';
import type { IOptions } from 'glob';

const { lodash: _, glob }: typeof utils = utils;
const globPromise: (pattern: string, options?: IOptions) => Promise<Array<string>> = promisify(glob);

/**
 * 获取redux的目录名称
 * @param { IApi } api
 */
export function getModelDir(api: IApi): string {
  if (api?.config?.modelName) {
    return api?.config?.modelName;
  }

  return api?.config?.singular ? 'model' : 'models';
}

/**
 * 获取models
 * @param { string } cwd: 目录
 * @param { string | undefined } pattern
 */
export async function getModels(cwd: string, pattern?: string): Promise<Array<string>> {
  const files: Array<string> = await globPromise(pattern ?? '**/*.{ts,tsx,js,jsx}', { cwd });

  return files.filter((file: string): boolean => {
    return !file.endsWith('.d.ts')
      && !file.endsWith('.test.js')
      && !file.endsWith('.test.jsx')
      && !file.endsWith('.test.ts')
      && !file.endsWith('.test.tsx');
  }).map((file: string): string => path.join(cwd, file));
}

/**
 * 获取redux的目录
 * @param { IApi } api
 */
export function getModelsPath(api: IApi): string {
  return path.join(api.paths.absSrcPath!, getModelDir(api));
}

/**
 * 获取所有的redux文件
 * @param { object } api
 */
export async function getAllModels(api: IApi): Promise<Array<string>> {
  const srcModelsPath: string = getModelsPath(api);

  return _.uniq([
    ...await getModels(srcModelsPath),
    ...await getModels(api.paths.absPagesPath!, `**/${ getModelDir(api) }/**/*.{ts,tsx,js,jsx}`)
  ]);
}