import * as React from 'react'
import {withRouter} from 'react-router'
import * as styles from './Event.css'

export namespace EventContainer {
  export interface Props {
    history: any,
    location: any,
  }

  export interface State {
  }
}

class EventContainer extends React.Component<EventContainer.Props, EventContainer.State> {
  constructor(props?: any, context?: any) {
    super(props, context)
  }

  componentDidMount() {
    console.log(this.props)
  }

  private goBack = (): void => {
    this.props.history.goBack()
  }

  public render() {
    return (
      <div className={styles.eventOverlayContainer}>
        <div className={styles.eventContainer}>
          <div className={styles.eventHeader}>
            <button onClick={this.goBack}>Go Back</button>
            <div style={{ textAlign: 'right' }}>
              <h1>{this.props.location.state.event.geo.city}</h1>
              <span>{this.props.location.state.event.description}</span>
            </div>
          </div>
          Test
        </div>
      </div>
    )
  }
}

export default withRouter(EventContainer)
