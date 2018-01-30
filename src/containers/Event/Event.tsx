import * as React from 'react'
import {withRouter} from 'react-router'
import * as styles from './Event.css'
import {Layer, Stage} from 'react-konva'
import {RippleEventView} from './Ripple'

export namespace EventContainer {
  export interface Props {
    history: any,
    location: any,
  }

  export interface State {
  }
}

class EventContainer extends React.Component<EventContainer.Props, EventContainer.State> {
  private stage: any
  constructor(props?: any, context?: any) {
    super(props, context)
  }

  // componentDidMount() {
  //   console.log(this.props.location.state.event)
  //   console.log(this.stage.getStage())
  // }

  private goBack = (): void => {
    this.props.history.goBack()
  }

  public render() {
    return (
      <div className={styles.eventOverlayContainer}>
        <div className={styles.eventContainer}>
          <div className={styles.eventHeader}>
            <button onClick={this.goBack}>Go Back</button>
            <div style={{textAlign: 'right'}}>
              <h1>{this.props.location.state.event.geo.city}</h1>
              <span>{this.props.location.state.event.description}</span>
            </div>
          </div>
          <Stage
            ref={node => this.stage = node}
            className={styles.stage}
            width={window.innerWidth}
            height={window.innerHeight}
            name={'eventStage'}
          >
            <Layer
              offset={{
                x: -window.innerWidth / 6,
                y: -window.innerHeight / 2,
              }}
            >
              {
                this.props.location.state.event.ripples.map((ripple, index) => {
                  const scale = 200 * (index + 1)
                  const r = scale / 2
                  return (
                    <RippleEventView
                      key={ripple.name + ripple.id}
                      ripple={ripple}
                      radius={r}
                    />
                  )
                })
              }
            </Layer>
          </Stage>
        </div>
      </div>
    )
  }
}

export default withRouter(EventContainer)
