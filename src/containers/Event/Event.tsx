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
import * as cello_a4 from '../../../public/media/syria_damascus/cello_A4.mp3'
import * as drone from '../../../public/media/drone_01_sound.mp3'

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
  private backgroundSound: any
  private sound: any
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

    // this.waveform = new Tone.Waveform(1024)
    // this.fft = new Tone.FFT(32)

    this.backgroundSound = new Tone.Player(drone).toMaster()
    // Create sound and attach it to an svg element
    // this.sound = new Tone.Player(sound).fan(this.fft, this.waveform).toMaster()
    // this.sound.autoStart = true

    // TEMPORARY
    data.forEach(event => {
      event.stats.forEach(stat => {
        // TODO: Figure out how to import mp3s inline in loop
        // const { geo } = event.properties
        // console.log(process.env.PUBLIC_URL);
        // const filePath = `${process.env.PUBLIC_URL}/media/${geo.map.toLowerCase()}_${geo.location.toLowerCase()}/${stat.sound}`
        // const sound = require(filePath)
        this.createRippleWave(stat, cello_a4).start()
      })
    })
  }

  /*
  * Set Sound and tie that to its own fft and waveform
  * Create an SVG of supplied radius
  * Create mouseover and mouseout events
  * Return an svg
  * */

  public createRippleWave = (stat, file) => {
    // setup
    const waveform = new Tone.Waveform(1024)
    const fft = new Tone.FFT(32)

    const envelope = new Tone.AmplitudeEnvelope({
      "attack": 1,
      "decay": 1,
      "sustain": 1,
      "release": 1
    }).toMaster()

    const sound = new Tone.Player({
      url: file,
      autoStart: true,
      // volume: -1,
      volume: -20,
      retrigger: true,
      loop: true,
    }).fan(fft, waveform).toMaster()

    // create svg
    const svg = d3.select(this.svgContainer)
      .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight)

    const svgCircles = svg.selectAll('circle')
      .data([100]) // radius in arrays
      .enter()
      .append('circle')

    svgCircles.attr('id', stat.id)
    svgCircles.attr('r', 0)
    svgCircles.attr('cx', window.innerWidth / 2)
    svgCircles.attr('cy', window.innerHeight / 2)
    svgCircles.attr('fill', 'none')
    svgCircles.attr('stroke-width', 5)
    svgCircles.attr('stroke', 'white')

    // mouse events
    const handleRippleHoverIn = () => {
      Tone.Transport.pause()
      sound.stop()
    }

    const handleRippleHoverOut = () => {
      Tone.Transport.start()
      sound.start()
    }

    // events
    svgCircles.on('mouseover', handleRippleHoverIn)
    svgCircles.on('mouseout', handleRippleHoverOut)

    /*
    * Schedule the Transport
    * This is the Tone.js equivalent of requestAnimationFrame
    * */
    Tone.Transport.schedule((time) => {
      const frequencyData = waveform.getValue()
      const max: number = Math.abs(parseFloat(d3.max(frequencyData)))
      const radius = () => (stat.id * 100) + (max * 100)
      svgCircles.attr('r', radius)
    })

    /*
    * Set Transport params
    * By setting loopEnd to 0 it runs like requestAnimationFrame
    * */
    Tone.Transport.loopStart = 0
    Tone.Transport.loopEnd = 0
    Tone.Transport.loop = true

    Tone.Transport.scheduleRepeat(time => {
      // do something
    }, '8n')

    /*
    * Send the trasnsport with a 0.05s delay for syncing
    * TODO: See if this is needed
    * */
    Tone.Transport.start('+0.05')

    return {
      start: () => setTimeout(() => sound.start(), 2000),
      stop: () => sound.stop()
    }
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
