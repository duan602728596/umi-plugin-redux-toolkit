import * as React from 'react';
import { createElement, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ApplyPluginsType } from 'umi';
import type { DeepPartial } from '@reduxjs/toolkit';
{{{ importAsyncLoadReducersContext }}}
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

  const initialState: DeepPartial<any> | undefined = runtimeReduxToolkit?.initialState;     // 初始化的state
  const otherIgnoreOptions: IgnoreOptions | undefined = runtimeReduxToolkit?.ignoreOptions; // 忽略检查的action和paths
  const warnAfter: number | undefined = runtimeReduxToolkit?.warnAfter;                     // 如果检查时间超过N ms，则打印警告

  return createElement(
    Provider,
    {
      store: storeFactory({
        initialState,
        ignoreOptions: otherIgnoreOptions,
        warnAfter
      })
    },
    {{{ container }}}
  );
}