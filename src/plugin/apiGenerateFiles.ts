import * as path from 'path';
import { promises as fs } from 'fs';
import type { IApi } from 'umi';
import { getAllModels } from './getModels';

/**
 * 读取文件
 * @param { string } file
 */
async function readFile(file: string): Promise<string> {
  return await fs.readFile(file, { encoding: 'utf8' });
}

/**
 * api.onGenerateFiles
 * @param { IApi } api
 */
function apiGenerateFiles(api: IApi): void {
  async function onGenerateFiles(): Promise<void> {
    /* ============= options ============= */
    // options
    const optionsContent: string = await readFile(path.join(__dirname, '../template/options.ts'));
    const ignoreOptions: string = api?.config?.ignoreOptions
      ? JSON.stringify(api.config.ignoreOptions, null, 2)
      : '{}';

    // models
    const models: Array<string> = await getAllModels(api);
    const requireArray: Array<string> = models.map((item: string) => `  require('${ item }').default`);
    const modelsContent: string = models.length > 0 ? `[
${ requireArray.join(',\n') }
]` : '[]';

    api.writeTmpFile({
      path: 'redux-toolkit/options.ts',
      content: `${ optionsContent }
export const ignoreOptions: IgnoreOptions = ${ ignoreOptions };
export const sliceOptions: Array<Slice> = ${ modelsContent }`
    });

    /* ============= 创建store ============= */
    api.writeTmpFile({
      path: 'redux-toolkit/store.ts',
      content: await readFile(path.join(__dirname, '../template/store.ts'))
    });

    /* ============= 创建runtime ============= */
    api.writeTmpFile({
      path: 'redux-toolkit/runtime.tsx',
      content: await readFile(path.join(__dirname, '../template/runtime.tsx'))
    });

    /* ============= 创建utils ============= */
    api.writeTmpFile({
      path: 'redux-toolkit/utils.ts',
      content: await readFile(path.join(__dirname, '../template/utils.ts'))
    });

    /* ============= 创建types.d.ts文件 ============= */
    api.writeTmpFile({
      path: 'redux-toolkit/types.d.ts',
      content: await readFile(path.join(__dirname, '../template/types.d.ts'))
    });
  }

  api.onGenerateFiles(onGenerateFiles);
}

export default apiGenerateFiles;