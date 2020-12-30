import { storeFactory, replaceReducers } from '../src/template/store';

test('store', function() {
  const store = storeFactory({
    ignoreOptions: {
      ignoredPaths: ['test_store.text'],
      ignoredActions: ['test_store/setText']
    }
  });

  replaceReducers([{
    name: 'test_store',
    initialState: { text: 'Hello.' },
    reducers: {
      setText(state, action) {
        state.text = action.payload;

        return state;
      }
    }
  }]);

  store.dispatch({
    type: 'test_store/setText',
    payload: 'Hello, world.'
  });

  const text = store.getState().test_store.text;

  expect(text).toBe('Hello, world.');
});