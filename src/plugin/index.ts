import { promises as fs } from 'fs';
import * as path from 'path';
import { utils, IApi } from 'umi';
import describe from './describe';
import { getAllModels } from './utils';

const { lodash: _ }: typeof utils = utils;

function umiPluginReduxToolkit(api: IApi): void {
  const { paths }: IApi = api;

  describe(api);

  api.onGenerateFiles(async function(): Promise<void> {
    // 创建store
    api.writeTmpFile({
      path: 'redux-toolkit/store.ts',
      content: await fs.readFile(path.join(__dirname, '../template/store.ts'), { encoding: 'utf8' })
    });

    // runtime
    api.writeTmpFile({
      path: 'redux-toolkit/runtime.tsx',
      content: await fs.readFile(path.join(__dirname, '../template/runtime.tsx'), { encoding: 'utf8' })
    });

    // options
    const optionsContent: string = await fs.readFile(path.join(__dirname, '../template/options.ts'), {
      encoding: 'utf8'
    });
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
  });

  api.addRuntimePlugin(function(): string {
    return path.join(paths.absTmpPath!, 'redux-toolkit/runtime.tsx');
  });

  api.addRuntimePluginKey(function(): string {
    return 'reduxToolkit';
  });
}

export default umiPluginReduxToolkit;