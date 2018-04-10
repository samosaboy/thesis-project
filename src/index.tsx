import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Redirect, Route, Router} from 'react-router'
import {createBrowserHistory} from 'history'
import {configureStore} from './store'
import App from './containers/App'

import 'normalize.css/normalize.css'

const store = configureStore()
export const history = createBrowserHistory()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
