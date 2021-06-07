import { createElement, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ApplyPluginsType } from 'umi';
import type { DeepPartial } from '@reduxjs/toolkit';
{{{ importDynamicReducers }}}
import { storeFactory, replaceReducers } from './store';
// @ts-ignore
import { plugin } from '../core/umiExports';
import type { IgnoreOptions, RuntimeReduxToolkit, RuntimeReduxToolkitApply } from './types';

/**
 * rootContainer
 * @param { ReactNode } container: 组件
 */
export function rootContainer(container: ReactNode): ReactElement {
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