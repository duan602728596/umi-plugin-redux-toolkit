import { createElement, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ApplyPluginsType } from 'umi';
import type { DeepPartial } from '@reduxjs/toolkit';
{{{ importDynamicReducers }}}
import { storeFactory, replaceReducers } from './store';
// @ts-ignore
import { plugin } from '../core/umiExports';
import type { IgnoreOptions, RuntimeReduxToolkit } from './types';

/* rootContainer */
export function rootContainer(container: ReactNode): ReactElement {
  const runtimeReduxToolkit: RuntimeReduxToolkit = plugin.applyPlugins({
    key: 'reduxToolkit',
    type: ApplyPluginsType.modify,
    initialValue: {}
  });

  return createElement(
    Provider,
    {
      store: storeFactory(RuntimeReduxToolkit)
    },
    {{{ container }}}
  );
}