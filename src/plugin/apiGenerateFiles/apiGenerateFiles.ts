import * as path from 'path';
import { promises as fs } from 'fs';
import type { IApi } from 'umi';
import { getAllModels } from './getModels';
import { optionsContent, type OptionsContentReturn } from './optionsContent';
import { getConfig, type PluginConfig } from '../utils';

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
    const models: Array<string> = await getAllModels(api); // 获取models中的文件
    const { importContent, sliceContent }: OptionsContentReturn = optionsContent(models, config?.esModule);
    const optionsTplContent: string = Mustache.render(await readTemplateFile('options.ts.tpl'), {
      ignoreOptions: config?.ignoreOptions ? JSON.stringify(config.ignoreOptions, null, 2) : '{}',
      importContent: importContent ?? '',
      slice: sliceContent
    });

    api.writeTmpFile({
      path: 'plugin-redux-toolkit/options.ts',
      content: optionsTplContent
    });

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