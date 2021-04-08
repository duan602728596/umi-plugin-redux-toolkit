# umi-plugin-redux-toolkit

umi3的插件，使用@reduxjs/toolkit。

## 安装

```
yarn add umi-plugin-redux-toolkit @reduxjs/toolkit
// or
npm install umi-plugin-redux-toolkit @reduxjs/toolkit
```

## 配置

* ignoreOptions { object } : 配置忽略的选项，参考
  [https://redux-toolkit.js.org/api/serializabilityMiddleware](https://redux-toolkit.js.org/api/serializabilityMiddleware)，
  当redux内的object可能是从`new Class`创建时，或者其他可能会导致警告的对象时，获取或调用action时会有警告，可以配置该选项忽略警告。
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
导出slice[参考](https://github.com/duan602728596/umi-plugin-redux-toolkit/blob/main/example/pages/models/add.js)，
导出createSlice的配置[参考](https://github.com/duan602728596/umi-plugin-redux-toolkit/blob/main/example/pages/models/index.js)。   

导出createSlice的配置时，如果reduces的key是通过createAction创建的，会自动去掉命名空间。例如：

```javascript
import { createAction } from '@redux/toolkit';

const action = createAction('index/action');

export default {
  name: 'index',
  reducers: {
    // 会自动将 index/action 变成 action
    [action](state, action) {
      return state;
    }
  }
};
```

## 初始值

在app.js内导出

```
export const reduxToolkit = {
  initialState: {},  // 初始化redux的值
  ignoreOptions: {}, // 同上面的ignoreOptions配置，会做合并处理
  warnAfter: 800     // immutableCheck和serializableCheck的检查时间超过32ms会有警告，修改警告时间
};
```

## 异步注入reducers

models文件夹中的`*.async.{js,jsx,ts,tsx}`文件会被认为是异步注入的reducers，不会被自动加载。   
配置`asyncLoadReducers: true`开启异步注入reducers功能。

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