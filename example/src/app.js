import { addListenerMiddleware } from './pages/models/add';

export const reduxToolkit = {
  initialState: {
    list: {
      dataList: [{ id: '3', name: '姜维' }]
    }
  },
  ignoreOptions: {
    ignoredPaths: ['login.loginList'],
    ignoredActions: ['login/setLoginList']
  },
  middlewares: [addListenerMiddleware.middleware]
};