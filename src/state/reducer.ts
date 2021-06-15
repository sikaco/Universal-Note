import { combineReducers, Reducer } from 'redux'
import { connectRouter as router } from 'connected-react-router'

export interface GlobalState {
  readonly form: Reducer<any>
  readonly router: { location: any }
}

export const createReducer = (asyncReducers: { [key: string]: Reducer<any> }) => {
  return combineReducers<GlobalState>({
    router,
  })
}
