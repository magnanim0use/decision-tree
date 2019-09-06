const loggerMiddleware = store => next => action => {
  console.log('initial state:', store.getState())
  console.log('dispatching:', action)
  next(action)
  console.log('next state:', store.getState())
}

export default loggerMiddleware;
