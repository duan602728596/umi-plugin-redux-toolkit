import { createApi } from '@reduxjs/toolkit/query/react';

function customFetchBaseQuery({ baseUrl }) {
  return function(args) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: [
            { id: '0', name: '周瑜' },
            { id: '1', name: '贾诩' },
            { id: '2', name: '卢植' }
          ]
        });
      }, 3_000);
    });
  };
}

const rtkQueryApi = createApi({
  reducerPath: 'rtkQuery',
  baseQuery: customFetchBaseQuery({ baseUrl: '/' }),
  endpoints(builder) {
    return {
      getMockData: builder.query({
        query: (q) => q
      })
    };
  }
});

export const { useGetMockDataQuery } = rtkQueryApi;
export default rtkQueryApi;