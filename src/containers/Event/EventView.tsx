import * as React from 'react'
import {withRouter} from 'react-router'
import * as styles from './Event.css'
import {Path, Layer, Stage} from 'react-konva'
import * as Konva from 'konva'
import RippleEventView from './Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import {Damascus} from '../../constants/paths'

interface Props {
  history: any,
  location: any,
  actions?: typeof actions,
  event: eventRippleActiveData,
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    event: state.eventRippleActive,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class EventContainer extends React.PureComponent<Props, {}> {
  private stage: any
  private layer: any

  constructor(props?: any, context?: any) {
    super(props, context)
  }

  componentDidMount() {
    this.animateMap()
  }

  private goBack = (): void => {
    this.props.history.goBack()
    this.props.actions.eventRippleActive({
      title: null,
      description: null,
      visual: null,
    })
  }

  private animateMap = (): void => {
    const restOfTheRipples = this.layer.children.filter((filter, index) => index !== 0)
    this.layer.children[0].to({
      opacity: 1,
      duration: 0.1,
      easing: Konva.Easings.ElasticEaseIn(),
      onFinish: () => {
        restOfTheRipples.forEach((ripple, index) => {
          ripple.to({
            opacity: 1,
            duration: ((index+2)/restOfTheRipples.length) * 2,
            easing: Konva.Easings.EaseIn(),
          })
        })
      },
    })

    const tween = new Konva.Tween({
      node: this.layer.children[0].getLayer().children[0],
      stroke: 'red',
      data: '0',
      duration: 3,
    })

    tween.play()

    console.log(this.layer.children[0].getLayer())


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
          <div
            className={styles.eventText}
            style={{
              width: window.innerWidth / 3,
              height: window.innerHeight,
              left: window.innerWidth / 2,
              top: 6 + 'em',
              fontSize: 1.8 + 'vw',
            }}>
            <span
              className={styles.header}
              style={{
                fontSize: 2.6 + 'vw',
                lineHeight: 3.6 + 'rem',
              }}
            >
              {this.props.event.title}
            </span>
            <p dangerouslySetInnerHTML={{__html: this.props.event.description}} />
          </div>
          <Stage
            draggable={false}
            ref={node => this.stage = node}
            className={styles.stage}
            width={window.innerWidth}
            height={window.innerHeight}
            name={'eventStage'}
          >
            <Layer
              draggable={false}
              ref={node => this.layer = node}
              offset={{
                x: -window.innerWidth / 6,
                y: -window.innerHeight / 2,
              }}
            >
              <Path
                x={-window.innerWidth / 6}
                y={-window.innerHeight / 2}
                opacity={0}
                data={Damascus}
                name={'rippleEventMap'}
                stroke={'#807775'}
                strokeWidth={2}
                rotation={0}
                strokeScaleEnabled={false}
                scale={{
                  x: 6,
                  y: 6,
                }}
              />
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
