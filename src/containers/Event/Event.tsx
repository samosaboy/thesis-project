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
import * as CloseIcon from './closeicon.png'

// Temporarily
import {data} from '../../../public/data.js'
import * as cello_a4 from '../../../public/media/syria_damascus/cello_A4.mp3'
import * as cello_d4 from '../../../public/media/syria_damascus/cello_D4.mp3'
import * as cello_d2 from '../../../public/media/syria_damascus/cello_D2.mp3'
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
  private svgElement: any

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
    this.handleClick = this.handleClick.bind(this)
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

    // create svgElement
    this.svgElement = d3.select(this.svgContainer)
      .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight)

    // this.waveform = new Tone.Waveform(1024)
    // this.fft = new Tone.FFT(32)

    this.backgroundSound = new Tone.Player({
      url: drone,
      autoStart: true,
      volume: -20,
      fadeIn: 2,
    }).toMaster()

    setTimeout(() => {
      this.backgroundSound.start()
    }, 2000)

    // TEMPORARY
    data.forEach(event => {
      // TODO: Figure out how to import mp3s inline in loop
      // const { geo } = event.properties
      // console.log(process.env.PUBLIC_URL);
      // const filePath = `${process.env.PUBLIC_URL}/media/${geo.map.toLowerCase()}_${geo.location.toLowerCase()}/${stat.sound}`
      // const sound = require(filePath)
      this.createRippleWave(event.stats)
    })
  }

  /*
  * Set Sound and tie that to its own fft and waveform
  * Create an SVG of supplied radius
  * Create mouseover and mouseout events
  * Return an svg
  * */

  public createRippleWave = (stats) => {
    const group = this.svgElement.selectAll('.circle')
      .data(stats, d => d.id) // number of elements
      .enter()
      .append('g')
      .classed('circle', true)

    group.attr('id', d => d.id)

    const circles = group.append('circle')
      .attr('r', d => d.id * 100)
      .attr('cx', window.innerWidth / 2)
      .attr('cy', window.innerHeight / 2)
      .attr('fill', 'none')
      .attr('stroke-width', 10)
      .attr('stroke', 'white')

    stats.forEach(stat => {
      this.generateSound(stat.id)
    })
  }

  public generateSound = (id) => {
    const waveform = new Tone.Waveform(1024)
    const fft = new Tone.FFT(32)

    let file
    let volume
    switch (id) {
      case 1:
        file = cello_d2
        volume = -20
        break
      case 2:
        file = cello_d4
        volume = -30
        break
      case 3:
        file = cello_a4
        volume = -35
        break
      default:
        break
    }

    const sound = new Tone.Player({
      url: file,
      autoStart: true,
      // volume: -1,
      volume: volume,
      retrigger: true,
      loop: false,
    }).fan(fft, waveform).toMaster()

    const loop = new Tone.Loop({
      'callback': (time) => {
        const now = Tone.now()
        sound.start(now).stop(now + 5)
      },
      'interval': '2n',
      'probability': 0.001
    })

    loop.start(0)

    /*
    * Schedule the Transport
    * This is the Tone.js equivalent of requestAnimationFrame
    * */
    // Find by id param in svgContainer
    const circle = this.svgElement.selectAll('g')
      .filter(d => d.id === id)
      .select('circle')

    Tone.Transport.schedule((time) => {
      const frequencyData = waveform.getValue()
      const max: number = parseFloat(d3.max(frequencyData)) * 10000
      circle.attr('r', d => (d.id * 100) + max)
    })

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
    circle.on('mouseover', handleRippleHoverIn)
    circle.on('mouseout', handleRippleHoverOut)

    /*
    * Set Transport params
    * By setting loopEnd to 0 it runs like requestAnimationFrame
    * */
    // Tone.Transport.loopStart = 0
    // Tone.Transport.loopEnd = 0
    Tone.Transport.loop = true

    /*
    * Send the trasnsport with a 0.05s delay for syncing
    * TODO: See if this is needed
    * */
    Tone.Transport.start('+0.05')

    // This starts all of them
    // setTimeout(() => sound.start(), 2000)

    return {
      start: () => setTimeout(() => sound.start(), 2000),
      stop: () => sound.stop()
    }
  }

  private handleClick() {
    this.props.history.goBack()
  }

  public render() {
    // FIX THIS AFTER
    const _event = data[0]
    return (
      <div style={styles.event}>
        <header style={styles.header}>
          <button
            onClick={this.handleClick}
            style={styles.close}
          >
            <img src={CloseIcon} />
          </button>
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
