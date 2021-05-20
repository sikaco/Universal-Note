export interface Todo {
  text: string
  completed: boolean
}
export interface StoreState {
  todos: Todo[]
  visibilityFilter: string
}
