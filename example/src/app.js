export const reduxToolkit = {
  initialState: {
    list: {
      dataList: [{ id: '3', name: '姜维' }]
    }
  },
  ignoreOptions: {
    ignoredPaths: ['login.loginList'],
    ignoredActions: ['login/setLoginList']
  }
};