import * as React from 'react'
import {withRouter} from 'react-router'
import * as styles from './Event.css'
import {Layer, Stage} from 'react-konva'
import RippleEventView from './Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import SyriaMap from '../../../_assets/syria_map.svg'

//TODO: Use SVGO with react-svg-loader
//TODO: Figure out how to display SVGS based on our data...
//TODO: Figure out how to offset the SVGs so it shows the ripple over the area you are talking about

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
class EventContainer extends React.Component<Props, {}> {
  private stage: any

  constructor(props?: any, context?: any) {
    super(props, context)
  }

  private goBack = (): void => {
    this.props.history.goBack()
    this.props.actions.eventRippleActive({
      title: null,
      description: null,
      visual: null,
    })
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
          <div>
            {/*{*/}
              {/*this.props.location.state.event.geo.map === 'Syria'*/}
                {/*? <SyriaMap*/}
                  {/*style={{*/}
                    {/*position: 'absolute',*/}
                    {/*bottom: '100px',*/}
                    {/*left: '-90px',*/}
                    {/*zIndex: 1000,*/}
                    {/*opacity: 0.8,*/}
                    {/*strokeDasharray: 2529,*/}
                    {/*strokeDashoffset: 2529,*/}
                  {/*}}*/}
                  {/*width={window.innerWidth}*/}
                  {/*height={window.innerHeight}*/}
                {/*/>*/}
                {/*: null*/}
            {/*}*/}
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
