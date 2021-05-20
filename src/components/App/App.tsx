import React from 'react'
import { Provider } from 'react-redux'
import { StoreState } from '../store/store'

interface AppProps {
  store: StoreState
}

export class App extends React.PureComponent<AppProps> {
  render() {
    return (
      <Provider store={this.props.store}>

      </Provider>
    )
  }
}
