import * as React from 'react'
import {Header, Helper} from '../../components'
import {Canvas} from '../Canvas/Canvas'
import * as styles from './style.css'
import Hover from '../../components/Hover/Hover'
import ReactCursorPosition from 'react-cursor-position'
import { Stage, Layer } from 'react-konva'

/* redux imports */
import * as actions from '../../actions/actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {RootState} from '../../reducers'
import {RouteComponentProps} from 'react-router'

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    actions: typeof actions,
    helper: ContextualHelperData,
    rippleActive: rippleActiveData
  }

  export interface State {
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.Component<App.Props, App.State> {
  render() {
    const {rippleActive, helper, actions, children} = this.props
    return (
      <main>
        <header className={styles.header}>
          <Header addHelper={actions.addHelper}/>
        </header>

        <ReactCursorPosition className={styles.HoverContainer}>
          <Hover text={rippleActive}/>
        </ReactCursorPosition>

        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Canvas rippleActive={actions.rippleActive} rippleText={rippleActive} addHelper={actions.addHelper}/>
          </Layer>
        </Stage>

        {children}

        <footer className={styles.helper}>
          <Helper helper={helper.text}/>
        </footer>
      </main>
    )
  }
}


function mapStateToProps(state: RootState) {
  return {
    helper: state.helper,
    rippleActive: state.rippleActive,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions as any, dispatch),
  }
}


