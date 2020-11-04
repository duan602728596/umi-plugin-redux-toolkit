import * as path from 'path';
import { utils, IApi } from 'umi';
import describe from './describe';
import apiGenerateFiles from './apiGenerateFiles';
import { pluginName } from './utils';

const { lodash: _ }: typeof utils = utils;

function umiPluginReduxToolkit(api: IApi): void {
  const { paths }: IApi = api;

  describe(api);
  apiGenerateFiles(api);

  api.addRuntimePlugin(function(): string {
    return path.join(paths.absTmpPath!, 'plugin-redux-toolkit/runtime.tsx');
  });

  api.addRuntimePluginKey(function(): string {
    return 'reduxToolkit';
  });
}

umiPluginReduxToolkit.pluginName = pluginName;

export default umiPluginReduxToolkit;