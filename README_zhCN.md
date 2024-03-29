# umi-plugin-redux-toolkit

umi@4的插件，使用@reduxjs/toolkit。

## 安装和使用

如果你想使用插件，首先需要安装。

```
yarn add umi-plugin-redux-toolkit @reduxjs/toolkit
// or
npm install umi-plugin-redux-toolkit @reduxjs/toolkit
```

安装后，你可能需要[启用插件](https://umijs.org/docs/guides/plugins#%E5%90%AF%E7%94%A8%E6%8F%92%E4%BB%B6)。

## 配置

* ignoreOptions { object } : 配置忽略的选项，参考
  [https://redux-toolkit.js.org/api/serializabilityMiddleware](https://redux-toolkit.js.org/api/serializabilityMiddleware)，
  当redux内的object可能是从`new Class`创建时，或者其他不可序列化的值，获取或调用action时会有警告，可以配置该选项忽略警告。
  * ignoreOptions.ignoredPaths { Array&lt;string&gt; }: 忽略取值。
  * ignoreOptions.ignoredActions  { Array&lt;string&gt; }: 忽略的actions。

* modelName { string } : 自定义model文件夹的名称，配置后忽略singular配置。
* singular { boolean } : 目录是否为单数。
* esModule { boolean } : 使用es6模块的方式引入。
* ignore { string | Array<string> } : 忽略的model文件。（参考glob的[ignore](https://www.npmjs.com/package/glob#options)配置）
* asyncLoadReducers { boolean } : 开启异步注入reducers的功能。（需要手动挂载在组件上，会比较麻烦一些，所以不太推荐）

### 如何配置

```javascript
// .umirc.js or umi.config.js
import { defineConfig } from 'umi';

export default {
  // umi-plugin-redux-toolkit的配置
  reduxToolkit: {
    esModule: true
  }
};
```

## 如何使用

创建`models`文件夹，在文件夹下创建ts或js文件，导出通过createSlice创建的slice，或createSlice的配置。   
导出slice[参考](https://github.com/duan602728596/umi-plugin-redux-toolkit/blob/main/example/src/pages/models/add.js)，
导出createSlice的配置[参考](https://github.com/duan602728596/umi-plugin-redux-toolkit/blob/main/example/src/pages/models/list.js)。   

```javascript
import { createSlice } from '@redux/toolkit';

const slice = createSlice({
  name: 'sliceName',
  initialState: { value: 0 },
  reducers: {
    addValue(state, action) {
      state.value++;
    }
  }
});

const { addValue } = slice.actions;

export default slice;
```

导出createSlice的配置时，如果reduces的key是通过createAction创建的，会自动去掉命名空间。例如：

```javascript
import { createAction } from '@redux/toolkit';

const action = createAction('sliceName/action');

export default {
  name: 'sliceName',
  initialState: { value: 0 },
  reducers: {
    // will automatically change index/action into action
    [action](state, action) {
      return state;
    }
  }
};
```

现在还支持导出 RTK RTKQuery 创建的 API。例如：

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints(builder) {
    return {
      getData: builder.query({
        query: (q) => q
      })
    };
  }
});

export const { useGetDataQuery } = api;
export default api;
```

现在还支持导出 listenerMiddleware。例如：

```javascript
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setAction } from './actions';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: setAction,
  effect(action, listenerApi) {
    console.log('Listener: setAction');
  }
});

export default listenerMiddleware;
```

## 初始值

在app.js内导出

```javascript
export const reduxToolkit = {
  initialState: {},    // 初始化redux的值
  ignoreOptions: {},   // 同上面的ignoreOptions配置，会做合并处理
  warnAfter: 800,      // immutableCheck和serializableCheck的检查时间超过32ms会有警告，修改警告时间
  reducers: {},        // 自定义添加reducers
  middlewares: [],     // 自定义添加middlewares
  treatStore(store) {} // 可以让你对store进行其他处理，比如挂载一些监听的方法
};

// 或

export function reduxToolkit() {
  return {
    initialState: () => ({}), // 也可以是一个函数来初始化redux的值
    ignoreOptions: {},        // 同上面的ignoreOptions配置，会做合并处理
    warnAfter: 800,           // immutableCheck和serializableCheck的检查时间超过32ms会有警告，修改警告时间
    reducers: {},             // 自定义添加reducers
    middlewares: [],          // 自定义添加middlewares
    treatStore(store) {}      // 可以让你对store进行其他处理，比如挂载一些监听的方法
  };
}
```

## 异步注入reducers

models文件夹中的`*.async.{js,jsx,ts,tsx}`文件会被认为是异步注入的reducers，不会被自动加载。   
配置`asyncLoadReducers: true`开启异步注入reducers功能。   

通过RTK Query创建的Api无法被异步加载，因为它需要添加middleware.

```javascript
import { dynamicReducers } from 'umi-plugin-redux-toolkit/dynamicReducers';
import model_0 from './models/model_0';
import model_1 from './models/model_1';

function Component(props) {
 return <div />;
}

export default dynamicReducers([model_0, model_1])(Component); // 多个model传递数组
// 或
export default dynamicReducers(model_0)(Component); // 单个model
```

## 获取store

你可以使用如下的方式获取store：

```javascript
import { store } from '@@/plugin-reduxToolkit/store';
```