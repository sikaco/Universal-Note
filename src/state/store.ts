const { routerMiddleware } = require('react-router-redux')
const gta = require('gta')
import { applyMiddleware, createStore, compose } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { BehaviorSubject } from 'rxjs'

import { Reducer, Store } from 'redux'
import { Epic } from 'redux-observable'
import { GlobalState } from './reducer'

import { createGtaMiddleware } from './middleware'

import { epics } from './epic'
import { createReducer } from './reducer'

interface GlobalStore<T> extends Store<T> {
  asyncReducers: { [key: string]: Reducer<any> }
}

const epic$ = new BehaviorSubject(combineEpics(...epics))

const WINDOW_INITIAL_STATE = {}

const configureStore = () => {
  const rootEpic = (a$: any, s: any) => epic$.mergeMap((e) => e(a$, s))
  const epicMiddleware = createEpicMiddleware<any, any>(rootEpic)

  const result = createStore(
    createReducer({}),
    WINDOW_INITIAL_STATE,
    compose(
      applyMiddleware(
        createGtaMiddleware(gta),
        epicMiddleware,
        routerMiddleware(history),
      ),
    )
  ) as GlobalStore<GlobalState>

  result.asyncReducers = {}

  return result
}

export const store = configureStore()

export const addUIReducer = (asyncReducers: { [key: string]: Reducer<any> }) => {
  store.asyncReducers = { ...store.asyncReducers, ...asyncReducers }
  store.replaceReducer(createReducer(store.asyncReducers))
}

const asyncEpics: Epic<any, any>[] = []
export const addEpic = (asyncEpic: Epic<any, any>) => {
  if (asyncEpics.every((e) => e !== asyncEpic)) {
    asyncEpics.push(asyncEpic)
    epic$.next(asyncEpic)
  }
}
