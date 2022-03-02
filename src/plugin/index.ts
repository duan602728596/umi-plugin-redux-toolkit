import * as path from 'path';
import { type IApi } from 'umi';
import describe from './describe';
import apiGenerateFiles from './apiGenerateFiles/apiGenerateFiles';
import { pluginName } from './utils';

function umiPluginReduxToolkit(api: IApi): void {
  describe(api);
  apiGenerateFiles(api);

  api.addRuntimePlugin(function(): string[] {
    return [path.join(api.paths.absTmpPath!, 'plugin-redux-toolkit/runtime.tsx')];
  });

  api.addRuntimePluginKey(function(): string[] {
    return ['reduxToolkit'];
  });
}

umiPluginReduxToolkit.pluginName = pluginName;

export default umiPluginReduxToolkit;