import * as React from 'react'
import {withRouter} from 'react-router'
import styles from './EventStyles'
import RippleEventView from '../../components/Event/Ripple/Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import {Group, Layer, Stage} from 'react-konva'
import Sound from 'react-sound'
import * as d3 from 'd3'

// Temporarily
import {data} from '../../../public/data.js'
import * as sound from '../../../public/media/test.mp3'

interface Props {
  history: any,
  location: any,
  actions?: typeof actions,
  data: any,
}

interface State {
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    event: state.eventActive,
    ripple: state.eventRippleActive
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class EventContainer extends React.Component<Props, State> {
  private layer: any
  private dimensions: {[key:string]: number}
  private svgContainer: HTMLElement
  private svg: any

  private audioContext: any
  private audioSrc: any
  private analyzer: any
  private audio: any
  private frequencyData: Uint8Array

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      mouse: {x: 0, y: 0}
    }
    this.dimensions = {
      width: 600,
      height: 600
    }
  }

  componentDidMount() {
    if (this.layer) {
      this.layer.setAttr('x', this.layer.getStage().width() / 2.3)
      this.layer.setAttr('y', this.layer.getStage().height() / 2.3)

      if (this.audio) {
        this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)()
        this.audioSrc = this.audioContext.createMediaElementSource(this.audio)
        this.analyzer = this.audioContext.createAnalyser()

        this.audioSrc.connect(this.analyzer)
        this.audioSrc.connect(this.audioContext.destination)

        this.frequencyData = new Uint8Array(10)

        if (this.svgContainer) {
          this.svg = d3.select(this.svgContainer)
            .append('svg')
            .attr('width', this.dimensions.width)
            .attr('height', this.dimensions.height)
        }
        this.renderChart()
      }
    }
  }

  renderChart = () => {
    requestAnimationFrame(this.renderChart)
    this.analyzer.getByteFrequencyData(this.frequencyData)

    const radiusScale = d3.scaleLinear()
      .domain([0, d3.max(this.frequencyData)])
      .range([0, (this.dimensions.height)])

    const hueScale = d3.scaleLinear()
      .domain([0, d3.max(this.frequencyData)])
      .range([0, 360])

    const circles = this.svg.selectAll('circle')
      .data(this.frequencyData)

    circles.enter().append('circle')

    circles.attr('r', (d) => radiusScale(d))
    circles.attr('cx', this.dimensions.width / 2)
    circles.attr('cy', this.dimensions.height / 2)
    circles.attr('fill', 'none')
    circles.attr('stroke-width', 6)
    circles.attr('stroke-opacity', 0.4)
    circles.attr('stroke', (d) => d3.hsl(hueScale(d), 1, 0.2))
  }

  public render() {
    // FIX THIS AFTER
    const _event = data[0]
    return (
      <div style={styles.event}>
        <header style={styles.header}>
          <h1 style={styles.geoText}>
            {_event.properties.geo.location}, {_event.properties.geo.map}
          </h1>
          <span style={styles.description}>
            {_event.properties.description}
          </span>
        </header>

        <audio
          ref={node => this.audio = node}
          src={sound}
          autoPlay
        />

        <div
          style={styles.svgContainer}
          ref={node => this.svgContainer = node}
        />

        <Stage
          name={'eventViewStage'}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Layer
            ref={node => this.layer = node}
          >
            {
              _event.ripples.map((ripple, index) => (
                <RippleEventView
                  key={ripple.properties.title}
                  ripple={ripple}
                  radius={(200*(index+1)) / ripple.id}
                />
              ))
            }
          </Layer>
        </Stage>
      </div>
    )
  }
}

export default withRouter(EventContainer)
