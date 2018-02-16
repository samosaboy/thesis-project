import * as React from 'react'
import {Header} from '../../components'
import Helper from '../../components/Helper/Helper'
import * as styles from './style.css'

import {connect} from 'react-redux'
import {RootState} from '../../reducers'
import {Route, RouteComponentProps, Switch} from 'react-router'
import EventContainer from '../Event/EventView'
import MainStage from '../MainStage/MainStage'

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    helper: ContextualHelperData,
  }

  export interface State {
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    helper: state.helper,
    rippleActive: state.rippleActive,
    position: state.position,
  }
}

@connect(mapStateToProps, null)
export class App extends React.Component<App.Props, App.State> {
  public render() {
    return (
      <main>
        <header className={styles.header}>
          <Header/>
        </header>

        <Switch>
          <Route
            exact
            path={'/:eventId'}
            component={EventContainer}
          />
          <Route
            path={'/'}
            component={MainStage}
          />
        </Switch>

        {this.props.children}

        <footer className={styles.helper}>
          <Helper helper={this.props.helper.text}/>
        </footer>
      </main>
    )
  }
}
