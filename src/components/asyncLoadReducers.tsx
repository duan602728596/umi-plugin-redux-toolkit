import * as React from 'react';
import { useMemo, useContext, ReactElement, FunctionComponent, ClassicComponentClass } from 'react';
import AsyncLoadReducersContext, { AsyncLoadReducersContextType } from './AsyncLoadReducersContext';
import type { SliceOptionsItem } from '../template/types';

interface AsyncLoadReducersReturn {
  (Module: FunctionComponent | ClassicComponentClass): FunctionComponent<any>;
}

function formatSliceOptions(sliceOptions: SliceOptionsItem | Array<SliceOptionsItem>): Array<SliceOptionsItem> {
  if (Object.prototype.toString.call(sliceOptions) === '[object Array]') {
    return sliceOptions as Array<SliceOptionsItem>;
  } else {
    return [sliceOptions] as Array<SliceOptionsItem>;
  }
}

/**
 * 异步注入reducer
 * @param { SliceOptionsItem | Array<SliceOptionsItem> } sliceOptions
 */
function asyncLoadReducers(sliceOptions: SliceOptionsItem | Array<SliceOptionsItem>): AsyncLoadReducersReturn {
  let injectModels: boolean = true; // 是否需要注入

  /**
   * 返回一个函数包装组件
   * @param { FunctionComponent | ClassicComponent } Module: 需要修饰的模块
   */
  return function(Module: FunctionComponent | ClassicComponentClass): FunctionComponent {
    return function(props: any): ReactElement {
      const context: AsyncLoadReducersContextType = useContext(AsyncLoadReducersContext);

      if (injectModels) {
        useMemo(function() {
          context?.replaceReducers?.(formatSliceOptions(sliceOptions));
          injectModels = false;
        }, []);
      }

      return <Module { ...props } />;
    };
  };
}

export default asyncLoadReducers;