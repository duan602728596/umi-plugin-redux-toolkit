import type { IApi } from 'umi';
import describe from './describe';
import apiGenerateFiles from './apiGenerateFiles/apiGenerateFiles';
import { pluginName } from './utils';

function umiPluginReduxToolkit(api: IApi): void {
  describe(api);
  apiGenerateFiles(api);

  api.addRuntimePlugin(function(): string[] {
    return [`@@/plugin-${ api.plugin.key }/runtime.tsx`];
  });

  api.addRuntimePluginKey(function(): string[] {
    return ['reduxToolkit'];
  });
}

umiPluginReduxToolkit.pluginName = pluginName;

export default umiPluginReduxToolkit;