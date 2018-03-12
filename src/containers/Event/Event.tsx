import * as React from 'react'
import {withRouter} from 'react-router'
import styles from './EventStyles'
import RippleEventView from '../../components/Event/Ripple/Ripple'
import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {RootState} from '../../reducers/index'
import * as Tone from 'tone'
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

  // svg setup
  private svgContainer: any
  private svgCircles: any

  // audio setup
  private analyser: any
  private synth: any
  private fft: any
  private waveform: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      mouse: {x: 0, y: 0}
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

    this.waveform = new Tone.Waveform(1024)
    this.fft = new Tone.FFT(32)

    this.synth = new Tone.Synth({
      'oscillator': {
        'type': 'fmsine4',
        'modulationType': 'square'
      }
    }).fan(this.fft, this.waveform).toMaster()

    this.createRipples()
  }

  createRipples = () => {
    if (this.svgContainer) {
      const svg = d3.select(this.svgContainer)
        .append('svg')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight)

      this.svgCircles = svg.selectAll('circle')
        .data([100]) // radius in arrays
        .enter()
        .append('circle')

      this.svgCircles.attr('r', 100)
      this.svgCircles.attr('cx', window.innerWidth / 2)
      this.svgCircles.attr('cy', window.innerHeight / 2)
      this.svgCircles.attr('fill', 'white')

      // events
      this.svgCircles.on('mouseover', this.handleRippleHover)
      this.svgCircles.on('mouseout', this.handleRippleHoverOut)
    }
  }

  handleRippleHover = () => {
    // For audio files you might have to use 'Tone.Player'
    const loop = new Tone.Pattern((time, note) => {
      this.synth.triggerAttackRelease(note, '4n', time)

      Tone.Draw.schedule(() => {
        /*
        * I think this runs requestAnimationFrame
        * */

        const frequencyData = this.synth.frequency.value
        console.log(frequencyData / 10)
        this.svgCircles.attr('r', frequencyData)
      }, time)
    }, ['C4', 'D4']).start(0)

    loop.interval = '4n'

    /*
    * Start the Transport
    * */

    Tone.Transport.start('+0.05')
  }

  handleRippleHoverOut = () => {
    Tone.Transport.stop()
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

        <div
          style={styles.svgContainer}
          ref={node => this.svgContainer = node}
        />

      </div>
    )
  }
}

export default withRouter(EventContainer)
