import { createElement, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
{{{ importDynamicReducers }}}
import { ApplyPluginsType, PluginManager } from 'umi';
import { getPluginManager } from '@@/core/plugin';
import { storeFactory, replaceReducers } from './store';
import type { RuntimeReduxToolkit, RuntimeReduxToolkitApply } from './types';

/**
 * rootContainer
 * @param { ReactNode } container: 组件
 */
export function rootContainer(container: ReactNode): ReactElement {
  const plugin: PluginManager = getPluginManager();
  const runtimeReduxToolkitApply: RuntimeReduxToolkitApply = plugin.applyPlugins({
    key: 'reduxToolkit',
    type: ApplyPluginsType.modify
  });
  const runtimeReduxToolkit: RuntimeReduxToolkit = typeof runtimeReduxToolkitApply === 'function'
    ? runtimeReduxToolkitApply() : runtimeReduxToolkitApply;

  return createElement(
    Provider,
    {
      store: storeFactory(runtimeReduxToolkit)
    },
    {{{ container }}}
  );
}