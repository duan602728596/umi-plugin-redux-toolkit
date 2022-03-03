import { createElement, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import type { DeepPartial } from '@reduxjs/toolkit';
{{{ importDynamicReducers }}}
import { ApplyPluginsType } from 'umi';
import { getPluginManager } from '@@/core/plugin';
import { storeFactory, replaceReducers } from './store';
import type { IgnoreOptions, RuntimeReduxToolkit, RuntimeReduxToolkitApply } from './types';

/**
 * rootContainer
 * @param { ReactNode } container: 组件
 */
export function rootContainer(container: ReactNode): ReactElement {
  const plugin = getPluginManager();
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