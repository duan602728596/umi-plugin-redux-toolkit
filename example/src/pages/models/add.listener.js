import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setAddNumber } from './add';

const addListenerMiddleware = createListenerMiddleware();

addListenerMiddleware.startListening({
  actionCreator: setAddNumber,
  effect(action, listenerApi) {
    console.log('Listener: setAddNumber');
  }
});

export default addListenerMiddleware;