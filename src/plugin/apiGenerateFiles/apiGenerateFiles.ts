import * as path from 'path';
import { promises as fs } from 'fs';
import type { IApi } from 'umi';
import { getAllModels } from './getModels';
import { getConfig, PluginConfig } from '../utils';
import { esModuleOptionsContent, commonjsOptionsContent } from './getContent';

/**
 * 读取文件
 * @param { string } file
 */
async function readTemplateFile(file: string): Promise<string> {
  return await fs.readFile(path.join(__dirname, '../../template', file), { encoding: 'utf8' });
}

/**
 * 替换文件名
 * @param { string } filename: 文件名
 */
function replaceFileName(filename: string): string {
  return filename.replace(/[~`!@#$%^&*()\-+={}\[\]\\|<>?/,\.]/ig, '_');
}

/**
 * api.onGenerateFiles
 * @param { IApi } api: umi api方法
 */
function apiGenerateFiles(api: IApi): void {
  async function onGenerateFiles(): Promise<void> {
    const { utils }: IApi = api;
    const { Mustache }: typeof utils = utils;
    const config: PluginConfig | undefined = getConfig(api);

    /* ============= options ============= */
    // options
    const optionsContent: string = await readTemplateFile('options.ts');
    const ignoreOptions: string = config?.ignoreOptions
      ? JSON.stringify(config.ignoreOptions, null, 2) : '{}';

    // models
    const models: Array<string> = await getAllModels(api);

    if (config?.esModule) {
      type moduleItem = { name: string; content: string };

      // es6
      const modelsEsModuleArray: Array<moduleItem> = models.map((item: string, index: number): moduleItem => {
        const parseResult: path.ParsedPath = path.parse(item);      // 解析文件名
        const filename: string = replaceFileName(parseResult.name); // 移除特殊字符，文件名转换成变量
        const variable: string = `model_${ filename }_${ index }`;  // 变量名

        return {
          name: variable,
          content: `import ${ variable } from '${ item }';`
        };
      });

      // 模块导入
      const importContent: string = modelsEsModuleArray.map((item: moduleItem): string => item.content).join('\n');

      // 变量
      const variableContent: string = modelsEsModuleArray.length > 0
        ? `[\n${ modelsEsModuleArray.map((item: moduleItem): string => `  ${ item.name }`).join(',\n') }\n]` : '[]';

      // 写入文件
      api.writeTmpFile({
        path: 'plugin-redux-toolkit/options.ts',
        content: esModuleOptionsContent({
          optionsContent,
          importContent,
          ignoreOptions,
          variableContent
        })
      });
    } else {
      // commonjs
      const modelsModuleRequireArray: Array<string> = models.map((item: string) => `  require('${ item }').default`);

      // 模块导入(commonjs)
      const modelsContent: string = modelsModuleRequireArray.length > 0
        ? `[\n${ modelsModuleRequireArray.join(',\n') }\n]` : '[]';

      // 写入文件
      api.writeTmpFile({
        path: 'plugin-redux-toolkit/options.ts',
        content: commonjsOptionsContent({
          optionsContent,
          ignoreOptions,
          modelsContent
        })
      });
    }

    /* ============= 创建store ============= */
    api.writeTmpFile({
      path: 'plugin-redux-toolkit/store.ts',
      content: await readTemplateFile('store.ts')
    });

    /* ============= 创建runtime ============= */
    const runtimeTpl: string = await readTemplateFile('runtime.tsx.tpl');
    let runtimeTplContent: string;

    if (config?.asyncLoadReducers) {
      runtimeTplContent = Mustache.render(runtimeTpl, {
        importDynamicReducers: "import { DynamicReducersContext } from 'umi-plugin-redux-toolkit/dynamicReducers'",
        container: `createElement(
      DynamicReducersContext.Provider,
      {
        value: {
          replaceReducers
        }
      },
      container
    )`
      });
    } else {
      runtimeTplContent = Mustache.render(runtimeTpl, {
        container: 'container'
      });
    }

    api.writeTmpFile({
      path: 'plugin-redux-toolkit/runtime.tsx',
      content: runtimeTplContent
    });

    /* ============= 创建helpers ============= */
    api.writeTmpFile({
      path: 'plugin-redux-toolkit/helpers.ts',
      content: await readTemplateFile('helpers.ts')
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