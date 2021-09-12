import { configureStore, combineReducers } from '@reduxjs/toolkit';

import reducers from 'reducers/rootReducer';
import auth from 'features/auth/slice';
import { api } from './api';

const combinedReducer = combineReducers({
  // these are the OLD reducers that are still being used/brought in
  ...reducers,
  // these are the new reducers created using RTK
  auth,
  // RTK query api reducer
  [api.reducerPath]: api.reducer,
});

const rootReducer = (state, action) => {
  switch (action.type) {
    // this case falls through so that it applies to either start/stop impersonating
    case 'auth/startImpersonating':
    case 'auth/stopImpersonating':
      // we want to preserve the auth slice of the state, but allow everything else to be wiped out
      // so that the rest of the data is re-initialized
      state = {
        auth: {
          ...state.auth,
        },
      };
      break;
    case 'auth/logoutUser':
      state = undefined;
      break;
    default:
      break;
  }

  if (action.type === 'auth/startImpersonating') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
