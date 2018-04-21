import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Redirect, Route, Router} from 'react-router'
import {createBrowserHistory} from 'history'
import {configureStore} from './app/store'
import App from './app/containers/App'

export const store = configureStore()
export const history = createBrowserHistory()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
