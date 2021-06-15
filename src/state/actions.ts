import { createAction, Action } from 'redux-actions'
import { ActionsObservable } from 'redux-observable'

export const noOpAction = createAction('NO_OP_ACTION')

export type EpicInput<T> = ActionsObservable<Action<T>>
