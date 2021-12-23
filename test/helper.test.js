import { createAction, createSlice } from '@reduxjs/toolkit';
import { mergeIgnoreOptions, formatReducers, isSlice, toReducers } from '../src/template/helper';

test('mergeIgnoreOptions func', function() {
  expect(mergeIgnoreOptions(undefined, undefined)).toStrictEqual({});

  expect(mergeIgnoreOptions({
    ignoredPaths: ['path/0', 'path/1']
  }, {
    ignoredPaths: ['path/2', 'path/3']
  })).toStrictEqual({
    ignoredPaths: ['path/0', 'path/1', 'path/2', 'path/3']
  });

  expect(mergeIgnoreOptions({
    ignoredActions: ['action/0', 'action/1']
  }, {
    ignoredActions: ['action/2', 'action/3']
  })).toStrictEqual({
    ignoredActions: ['action/0', 'action/1', 'action/2', 'action/3']
  });

  expect(mergeIgnoreOptions({
    ignoredPaths: ['path/0', 'path/1']
  }, {
    ignoredActions: ['action/2', 'action/3']
  })).toStrictEqual({
    ignoredPaths: ['path/0', 'path/1'],
    ignoredActions: ['action/2', 'action/3']
  });

  expect(mergeIgnoreOptions({
    ignoredPaths: ['path/0', 'path/1'],
    ignoredActions: ['action/0', 'action/1']
  }, {
    ignoredPaths: ['path/2', 'path/3'],
    ignoredActions: ['action/2', 'action/3']
  })).toStrictEqual({
    ignoredPaths: ['path/0', 'path/1', 'path/2', 'path/3'],
    ignoredActions: ['action/0', 'action/1', 'action/2', 'action/3']
  });
});

test('formatReducers func', function() {
  const action_test_0 = createAction('formatReducers/action_test_0');
  const func = (state, action) => {
    return state;
  };
  const newReducers = formatReducers({
    [action_test_0]: func
  }, /formatReducers\//);

  expect(newReducers).toStrictEqual({
    action_test_0: func
  });
});

test('isSlice func', function() {
  expect(isSlice({
    name: 'isSlice_func_test_0',
    initialState: {}
  })).toBe(false);

  expect(isSlice(createSlice({
    name: 'isSlice_func_test_1',
    initialState: {}
  }))).toBe(true);
});

test('toReducers func', function() {
  const sliceOptions = [
    createSlice({
      name: 'toReducers_func_test_0',
      initialState: { number: 55 },
      reducers: {
        setNumber(state, action) {
          state.number = action.payload;

          return state;
        }
      }
    }),
    {
      name: 'toReducers_func_test_1',
      initialState: { number: 12 },
      reducers: {
        setNumber(state, action) {
          state.number = action.payload;

          return state;
        }
      }
    }
  ];

  const reducers = toReducers(sliceOptions);

  expect('toReducers_func_test_0' in reducers).toBe(true);
  expect(typeof reducers.toReducers_func_test_0 === 'function').toBe(true);
  expect('toReducers_func_test_1' in reducers).toBe(true);
  expect(typeof reducers.toReducers_func_test_1 === 'function').toBe(true);
});