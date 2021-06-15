export const createGtaMiddleware = (gta: any) => (_: any) => (next: any) => (action: any) => {
  if (action.meta && action.meta.gta) {
    gta.event(action.meta.gta)
  }
  return next(action)
}

export const withGta = (actionCreator: any, property: any) => (payload: any) => {
  const action = actionCreator(payload)
  let gtaEvent
  if (typeof property === 'function') {
    gtaEvent = property(payload)
  } else {
    gtaEvent = property
  }
  action.meta = { ...action.meta, gta: gtaEvent }
  return action
}
