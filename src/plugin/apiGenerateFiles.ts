import * as path from 'path';
import { promises as fs } from 'fs';
import type { IApi } from 'umi';
import { getAllModels } from './getModels';
import { getConfig, PluginConfig } from './utils';

/**
 * 读取文件
 * @param { string } file
 */
async function readTemplateFile(file: string): Promise<string> {
  return await fs.readFile(path.join(__dirname, '../template', file), { encoding: 'utf8' });
}

/* 替换文件名 */
function replaceFileName(filename: string): string {
  return filename.replace(/[~`!@#$%^&*()-+={}\[\]\\|<>?/,\.]/ig, '_');
}

/**
 * api.onGenerateFiles
 * @param { IApi } api
 */
function apiGenerateFiles(api: IApi): void {
  async function onGenerateFiles(): Promise<void> {
    const config: PluginConfig | undefined = getConfig(api);

    /* ============= options ============= */
    // options
    const optionsContent: string = await readTemplateFile('options.ts');
    const ignoreOptions: string = config?.ignoreOptions
      ? JSON.stringify(config.ignoreOptions, null, 2)
      : '{}';

    // models
    const models: Array<string> = await getAllModels(api);

    if (config?.esModule) {
      type moduleItem = { name: string; content: string };

      // es6
      const modelsEsModuleArray: Array<moduleItem> = models.map((item: string, index: number): moduleItem => {
        const parseResult: path.ParsedPath = path.parse(item);
        const filename: string = replaceFileName(parseResult.name);
        const variable: string = `model_${ filename }_${ index }`;

        return {
          name: variable,
          content: `import ${ variable } from '${ item }';`
        };
      });
      const importContent: string = modelsEsModuleArray.map((item: moduleItem): string => item.content).join('\n');
      const variableContent: string = modelsEsModuleArray.length > 0
        ? `[\n${ modelsEsModuleArray.map((item: moduleItem): string => `  ${ item.name }`).join(',\n') }\n]`
        : '[]';

      api.writeTmpFile({
        path: 'plugin-redux-toolkit/options.ts',
        content: `${ optionsContent }

${ importContent }

export const ignoreOptions: IgnoreOptions = ${ ignoreOptions };
export const sliceOptions: Array<sliceOptionsItem> = ${ variableContent };`
      });
    } else {
      // commonjs
      const modelsModuleRequireArray: Array<string> = models.map((item: string) => `  require('${ item }').default`);
      const modelsContent: string = modelsModuleRequireArray.length > 0 ? `[
${ modelsModuleRequireArray.join(',\n') }
]` : '[]';

      api.writeTmpFile({
        path: 'plugin-redux-toolkit/options.ts',
        content: `${ optionsContent }

export const ignoreOptions: IgnoreOptions = ${ ignoreOptions };
export const sliceOptions: Array<sliceOptionsItem> = ${ modelsContent };`
      });
    }

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