import { storeFactory, replaceReducers } from '../src/template/store';

test('store', function() {
  class Data {
    constructor() {
      this.data = 156;
    }
  }

  const store = storeFactory({
    ignoreOptions: {
      ignoredPaths: ['test_store_2.data'],
      ignoredActions: ['test_store_2/setData']
    }
  });

  replaceReducers([
    {
      name: 'test_store',
      initialState: {
        text: 'Hello.'
      },
      reducers: {
        setText(state, action) {
          state.text = action.payload;

          return state;
        }
      }
    },
    {
      name: 'test_store_2',
      initialState: {
        data: new Data()
      },
      reducers: {
        setData(state, action) {
          state.data.data = action.payload;

          return state;
        }
      }
    }
  ]);

  store.dispatch({
    type: 'test_store/setText',
    payload: 'Hello, world.'
  });

  store.dispatch({
    type: 'test_store_2/setData',
    payload: 179
  });

  const text = store.getState().test_store.text;
  const data = store.getState().test_store_2.data;

  expect(text).toBe('Hello, world.');
  expect(data.data).toBe(179);
});