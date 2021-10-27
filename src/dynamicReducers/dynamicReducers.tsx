import { createElement, useMemo, useContext, ReactElement, FunctionComponent, ClassicComponentClass } from 'react';
import DynamicReducersContext, { DynamicReducersContextType } from './DynamicReducersContext';
import type { SliceOptionsItem } from '../template/types';

interface AsyncLoadReducersComponent<T> {
  (Module: FunctionComponent | ClassicComponentClass): FunctionComponent<T>;
}

type SliceOptions = SliceOptionsItem | Array<SliceOptionsItem>;

/**
 * 将slice格式化成数组
 * @param { SliceOptions } sliceOptions: slice或创建slice的配置
 * @return { Array<SliceOptionsItem> }
 */
function formatSliceOptions(sliceOptions: SliceOptions): Array<SliceOptionsItem> {
  return Array.isArray(sliceOptions) ? sliceOptions : [sliceOptions];
}

/**
 * 异步注入reducer
 * @param { SliceOptions } sliceOptions
 * @return { AsyncLoadReducersComponent }
 */
function dynamicReducers<T = Record<string, any>>(sliceOptions: SliceOptions): AsyncLoadReducersComponent<T> {
  let injectModels: boolean = true; // 是否需要注入

  /**
   * 返回一个函数包装组件
   * @param { FunctionComponent | ClassicComponent } Module: 需要修饰的模块
   * @return { FunctionComponent }
   */
  return function(Module: FunctionComponent | ClassicComponentClass): FunctionComponent {
    return function(props: T): ReactElement {
      const context: DynamicReducersContextType = useContext(DynamicReducersContext);

      if (injectModels) {
        useMemo(function() {
          context?.replaceReducers?.(formatSliceOptions(sliceOptions));
          injectModels = false;
        }, []);
      }

      return createElement(Module, { ...props });
    };
  };
}

export default dynamicReducers;