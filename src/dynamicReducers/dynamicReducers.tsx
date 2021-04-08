import { createElement, useMemo, useContext, ReactElement, FunctionComponent, ClassicComponentClass } from 'react';
import DynamicReducersContext, { DynamicReducersContextType } from './DynamicReducersContext';
import type { SliceOptionsItem } from '../template/types';

interface AsyncLoadReducersReturn {
  (Module: FunctionComponent | ClassicComponentClass): FunctionComponent<any>;
}

/**
 * 将slice格式化成数组
 * @param { SliceOptionsItem | Array<SliceOptionsItem> } sliceOptions: slice或创建slice的配置
 * @return { Array<SliceOptionsItem> }
 */
function formatSliceOptions(sliceOptions: SliceOptionsItem | Array<SliceOptionsItem>): Array<SliceOptionsItem> {
  return Array.isArray(sliceOptions) ? sliceOptions : [sliceOptions];
}

/**
 * 异步注入reducer
 * @param { SliceOptionsItem | Array<SliceOptionsItem> } sliceOptions
 * @return { AsyncLoadReducersReturn }
 */
function dynamicReducers(sliceOptions: SliceOptionsItem | Array<SliceOptionsItem>): AsyncLoadReducersReturn {
  let injectModels: boolean = true; // 是否需要注入

  /**
   * 返回一个函数包装组件
   * @param { FunctionComponent | ClassicComponent } Module: 需要修饰的模块
   * @return { FunctionComponent }
   */
  return function(Module: FunctionComponent | ClassicComponentClass): FunctionComponent {
    return function(props: any): ReactElement {
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