import * as React from 'react';
import { createElement, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ApplyPluginsType } from 'umi';
import { storeFactory } from './store';
// @ts-ignore
import { plugin } from '../core/umiExports';
import { IgnoreOptions } from './types';

export function rootContainer(container: ReactNode): ReactElement {
  const runtimeReduxToolkit: any = plugin.applyPlugins({
    key: 'reduxToolkit',
    type: ApplyPluginsType.modify,
    initialValue: {}
  });
  const initialState: any = runtimeReduxToolkit?.initialState; // 初始化的state
  const otherIgnoreOptions: IgnoreOptions = runtimeReduxToolkit?.ignoreOptions; // 忽略检查的action和paths

  return createElement(
    Provider,
    { store: storeFactory(initialState, otherIgnoreOptions) },
    container
  );
}