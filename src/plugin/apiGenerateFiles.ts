import * as path from 'path';
import { promises as fs } from 'fs';
import type { IApi } from 'umi';
import { getAllModels } from './getModels';

/**
 * 读取文件
 * @param { string } file
 */
async function readTemplateFile(file: string): Promise<string> {
  return await fs.readFile(path.join(__dirname, '../template', file), { encoding: 'utf8' });
}

/**
 * api.onGenerateFiles
 * @param { IApi } api
 */
function apiGenerateFiles(api: IApi): void {
  async function onGenerateFiles(): Promise<void> {
    /* ============= options ============= */
    // options
    const optionsContent: string = await readTemplateFile('options.ts');
    const ignoreOptions: string = api?.config?.ignoreOptions
      ? JSON.stringify(api.config.ignoreOptions, null, 2)
      : '{}';

    // models
    const models: Array<string> = await getAllModels(api);
    const moduleArray: Array<string> = models.map((item: string) => `  require('${ item }').default`);
    const modelsContent: string = moduleArray.length > 0 ? `[
${ moduleArray.join(',\n') }
]` : '[]';

    api.writeTmpFile({
      path: 'plugin-redux-toolkit/options.ts',
      content: `${ optionsContent }

export const ignoreOptions: IgnoreOptions = ${ ignoreOptions };
export const sliceOptions: Array<sliceOptionsItem> = ${ modelsContent }`
    });

    /* ============= 创建store ============= */
    api.writeTmpFile({
      path: 'plugin-redux-toolkit/store.ts',
      content: await readTemplateFile('store.ts')
    });

    /* ============= 创建runtime ============= */
    api.writeTmpFile({
      path: 'plugin-redux-toolkit/runtime.tsx',
      content: await readTemplateFile('runtime.tsx')
    });

    /* ============= 创建utils ============= */
    api.writeTmpFile({
      path: 'plugin-redux-toolkit/utils.ts',
      content: await readTemplateFile('utils.ts')
    });

    /* ============= 创建types.d.ts文件 ============= */
    api.writeTmpFile({
      path: 'plugin-redux-toolkit/types.d.ts',
      content: await readTemplateFile('types.d.ts')
    });
  }

  api.onGenerateFiles(onGenerateFiles);
}

export default apiGenerateFiles;