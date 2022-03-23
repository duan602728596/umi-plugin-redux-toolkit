import { createAsyncThunk } from '@reduxjs/toolkit';

// mockDate
const resMock = [
  { id: '0', name: '关羽' },
  { id: '1', name: '刘备' },
  { id: '2', name: '夏侯惇' }
];

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
}

export const requestList = createAsyncThunk('index/requestList', async function() {
  await sleep(3000);

  return resMock;
});

export default {
  name: 'list',
  initialState: {
    dataList: []
  },
  extraReducers: {
    [requestList.fulfilled](state, action) {
      state.dataList = [...action.payload, ...state.dataList];
    }
  }
};