# umi-plugin-redux-toolkit

[中文文档](README_zhCN.md)

The plugin of umi@4 uses @reduxjs/toolkit.

## Install and use

If you want to use plugin, you must install first.

```
yarn add umi-plugin-redux-toolkit @reduxjs/toolkit
// or
npm install umi-plugin-redux-toolkit @reduxjs/toolkit
```

Finish installed, you may [enable the plugin](https://umijs.org/docs/guides/plugins#%E5%90%AF%E7%94%A8%E6%8F%92%E4%BB%B6).

## Configuration

* ignoreOptions { object } : Configure ignored options, refer to   
  [https://redux-toolkit.js.org/api/serializabilityMiddleware](https://redux-toolkit.js.org/api/serializabilityMiddleware),   
  When the object in redux may be created from `new Class`, or other non-serializable values,   
  there will be a warning when the action is obtained or called, and this option can be configured to ignore the warning.
  * ignoreOptions.ignoredPaths { Array&lt;string&gt; } : Ignore value.
  * ignoreOptions.ignoredActions  { Array&lt;string&gt; } : Ignored actions.

* modelName { string } : Customize the name of the model folder and ignore the singular configuration after configuration.
* singular { boolean } : Whether the directory is singular.
* esModule { boolean } : Import using the es6 module method.
* ignore { string | Array<string> } : Ignored model files. (Refer to the [ignore](https://www.npmjs.com/package/glob#options) configuration of glob)
* asyncLoadReducers { boolean } : Enable the function of asynchronously injecting reducers.   
  (Need to manually mount on the component, it will be more troublesome, so it is not recommended).

### How to configure

```javascript
// .umirc.js or umi.config.js
import { defineConfig } from 'umi';

export default {
  // Configuration of umi-plugin-redux-toolkit
  reduxToolkit: {
    esModule: true
  }
};
```

## How to use

Create the `models` folder, create a ts or js file under the folder, and export the slice created by createSlice, or the configuration of createSlice.   
Export slice [Reference](https://github.com/duan602728596/umi-plugin-redux-toolkit/blob/main/example/src/pages/models/add.js),
Export the configuration of createSlice [Reference](https://github.com/duan602728596/umi-plugin-redux-toolkit/blob/main/example/src/pages/models/index.js).   

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

When exporting the configuration of createSlice, if the reduce key is created by createAction, the namespace will be automatically removed. E.g:

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

Now also supports exporting APIs created by RTK RTKQuery. E.g:

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

Exporting listenerMiddleware is now also supported. E.g:

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

## Initial value

Export in app.js

```javascript
export const reduxToolkit = {
  initialState: {},    // Initialize the value of redux
  ignoreOptions: {},   // Same as the ignoreOptions configuration above, it will be merged
  warnAfter: 800,      // If the check time of immutableCheck and serializableCheck exceeds 32ms, there will be a warning. Modify the warning time
  reducers: {},        // Custom add reducers
  middlewares: [],     // Custom add middlewares
  treatStore(store) {} // Allows you to perform other processing on the store, such as mounting some monitoring methods
};

// or

export function reduxToolkit() {
  return {
    initialState: () => ({}), // It can also be a function to initialize the value of redux
    ignoreOptions: {},        // Same as the ignoreOptions configuration above, it will be merged
    warnAfter: 800,           // If the check time of immutableCheck and serializableCheck exceeds 32ms, there will be a warning. Modify the warning time
    reducers: {},             // Custom add reducers
    middlewares: [],          // Custom add middlewares
    treatStore(store) {}      // Allows you to perform other processing on the store, such as mounting some monitoring methods
  };
}
```

## Asynchronous injection of reducers

The `*.async.{js,jsx,ts,tsx}` files in the models folder will be considered as asynchronously injected reducers and will not be automatically loaded.   
Configure `asyncLoadReducers: true` to enable asynchronous injection of reducers.   

Api created by RTK RTKQuery cannot be loaded asynchronously because it needs to add middleware.

```javascript
import { dynamicReducers } from 'umi-plugin-redux-toolkit/dynamicReducers';
import model_0 from './models/model_0';
import model_1 from './models/model_1';

function Component(props) {
 return <div />;
}

export default dynamicReducers([model_0, model_1])(Component); // Multiple models pass array
// or
export default dynamicReducers(model_0)(Component); // Single model
```

## Get the store object

You can get the store object in the following way:

```javascript
import { store } from '@@/plugin-reduxToolkit/store';
```