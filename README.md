# umi-plugin-redux-toolkit

umi插件，使用@reduxjs/toolkit。

## 安装

```
yarn add umi-plugin-redux-toolkit @reduxjs/toolkit
// or
npm install umi-plugin-redux-toolkit @reduxjs/toolkit
```

## 配置

* ignoreOptions { object } 配置忽略的选项，参考
  [https://redux-toolkit.js.org/api/serializabilityMiddleware](https://redux-toolkit.js.org/api/serializabilityMiddleware)，
  当redux内的object可能是从`new Class`创建时，获取或调用action时会有警告，可以配置该选项忽略警告。
  * ignoreOptions.ignoredPaths { Array<string> }: 忽略的actions。
  * ignoreOptions.ignoredActions  { Array<string> }: 忽略取值。

* modelName { string }: 自定义model文件夹的名称，配置后忽略singular配置。
* singular { boolean }: 目录是否为单数。

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
  initialState: {}, // 初始化redux的值
  ignoreOptions: {} // 同上面的ignoreOptions配置，会做合并处理
};
```