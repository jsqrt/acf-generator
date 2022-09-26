import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import monitorReducer from './enhancers/monitorReducer'
import loggerMiddleware from './middleware/logger'
import { rootReducer } from './reducers'

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()],
    preloadedState,
    enhancers: [monitorReducer],
  })

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store;
};
