import * as React from 'react'
import {withRouter} from 'react-router'
import styles from './EventStyles'
import RippleEventView from '../../components/Event/Ripple/Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import {Group, Layer, Stage} from 'react-konva'
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
  private dimensions: { [key: string]: number }
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
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  /*
  * Get audio samples and sort by frequency
  * Load stats & statsData
  * Show stats and increment according to statsData
  * Every time it increments, run a function that generates audio
  * Do this for all stats
  *
  * Play something in the background as well
  * */

  componentDidMount() {
    if (this.layer) {
      this.layer.setAttr('x', this.layer.getStage().width() / 2.35)
      this.layer.setAttr('y', this.layer.getStage().height() / 2.4)
    }
    // this.captureAudioFromFile(this.audio)
  }

  captureAudioFromFile = (audio) => {
    if (audio) {
      this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)()
      this.audioSrc = this.audioContext.createMediaElementSource(audio)
      this.analyzer = this.audioContext.createAnalyser()

      this.audioSrc.connect(this.analyzer)
      this.audioSrc.connect(this.audioContext.destination)

      // 1024 = full range
      this.frequencyData = new Uint8Array(3)

      if (this.svgContainer) {
        this.svg = d3.select(this.svgContainer)
          .append('svg')
          .attr('width', this.dimensions.width)
          .attr('height', this.dimensions.height)
      }
      this.renderRipplesFromAudio()
    }
  }

  renderRipplesFromAudio = () => {
    requestAnimationFrame(this.renderRipplesFromAudio)
    this.analyzer.getByteFrequencyData(this.frequencyData)

    const radiusScale = d3.scaleLinear()
      .domain([0, d3.max(this.frequencyData)])
      .range([0, (this.dimensions.height/3)])

    const hueScale = d3.scaleLinear()
      .domain([0, d3.max(this.frequencyData)])
      // default [0, 360]
      .range([180, 360])

    const circles = this.svg.selectAll('circle')
      .data(this.frequencyData)

    circles.enter().append('circle')

    circles.attr('r', (d) => radiusScale(d))
    circles.attr('cx', this.dimensions.width / 2)
    circles.attr('cy', this.dimensions.height / 2)
    circles.attr('fill', 'none')
    circles.attr('stroke-width', 10)
    circles.attr('stroke-opacity', 0.7)
    circles.attr('stroke', (d) => d3.hsl(hueScale(d), 1, 0.3))

    circles.on('mouseover.react', (d, i) => {
      console.log(d3.select(d))
      // d3.select(d)
      //   .attr('stroke-opacity', 1)
    })
    // circles.on('mouseout', this.audio.play())
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
          // autoPlay
        />

        <div
          style={styles.svgContainer}
          ref={node => this.svgContainer = node}
        />

        {/*<Stage*/}
          {/*name={'eventViewStage'}*/}
          {/*width={window.innerWidth}*/}
          {/*height={window.innerHeight}*/}
        {/*>*/}
          {/*<Layer*/}
            {/*ref={node => this.layer = node}*/}
          {/*>*/}
            {/*{*/}
              {/*_event.ripples.map((ripple, index) => (*/}
                {/*<RippleEventView*/}
                  {/*audio={this.audio}*/}
                  {/*key={ripple.properties.title}*/}
                  {/*ripple={ripple}*/}
                  {/*radius={(200 * (index + 1)) / ripple.id}*/}
                {/*/>*/}
              {/*))*/}
            {/*}*/}
          {/*</Layer>*/}
        {/*</Stage>*/}
      </div>
    )
  }
}

export default withRouter(EventContainer)
