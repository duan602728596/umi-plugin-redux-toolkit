import { createSlice, createListenerMiddleware } from '@reduxjs/toolkit';

export const addListenerMiddleware = createListenerMiddleware();
const slice = createSlice({
  name: 'add',
  initialState: {
    number: 0
  },
  reducers: {
    setAddNumber(state, action) {
      state.number = state.number + 1;

      return state;
    }
  }
});

export const { setAddNumber } = slice.actions;

addListenerMiddleware.startListening({
  actionCreator: setAddNumber,
  effect(action, listenerApi) {
    listenerApi.cancelActiveListeners();
  }
});

export default slice;