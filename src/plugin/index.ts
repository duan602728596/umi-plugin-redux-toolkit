import * as path from 'path';
import { utils, IApi } from 'umi';
import describe from './describe';
import apiGenerateFiles from './apiGenerateFiles';

const { lodash: _ }: typeof utils = utils;

function umiPluginReduxToolkit(api: IApi): void {
  const { paths }: IApi = api;

  describe(api);
  apiGenerateFiles(api);

  api.addRuntimePlugin(function(): string {
    return path.join(paths.absTmpPath!, 'redux-toolkit/runtime.tsx');
  });

  api.addRuntimePluginKey(function(): string {
    return 'reduxToolkit';
  });
}

export default umiPluginReduxToolkit;