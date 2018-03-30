import * as React from 'react'
import {Header} from '../../components'
import * as styles from './style.css'
import {Route, Switch} from 'react-router'
import EventContainer from '../Event/Event'
import MainStage from '../Stage/Stage'

import {history} from "../../index"

class App extends React.Component<null, null> {
  public render() {
    return (
      <main>
        <header className={styles.header}>
          <Header/>
        </header>

        <Switch>
          <Route
            exact
            path={'/'}
            render={() => <div>
              <button onClick={() => history.push('/pond')}>
                Go!
              </button>
            </div>}
          />
          <Route
            key={'mainStage'}
            path={'/pond'}
            component={MainStage}
          />
          <Route
            key={'eventId'}
            path={'/event/:eventId'}
            component={EventContainer}
          />
        </Switch>

        {this.props.children}
      </main>
    )
  }
}

export default App
