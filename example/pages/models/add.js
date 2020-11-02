import { createSlice } from '@reduxjs/toolkit';

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

export default slice;