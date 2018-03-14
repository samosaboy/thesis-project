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
import * as viola_c5 from '../../../public/media/syria_damascus/viola_C5.mp3'
import * as violin_as4 from '../../../public/media/syria_damascus/violin_As4.mp3'
import * as cello_d4 from '../../../public/media/syria_damascus/cello_D4.mp3'
import * as cello_d2 from '../../../public/media/syria_damascus/cello_D2.mp3'
import * as drone from '../../../public/media/drone_01_sound.mp3'
import * as drone2 from '../../../public/media/drone_02_sound.mp3'
import * as atmosphericDrone from '../../../public/media/atmosphereic_drone_03.wav'

interface Props {
  history: any,
  location: any,
  actions?: typeof actions,
  event: any,
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
  // svg setup
  private svgContainer: any
  private svgElement: any

  // audio setup
  private backgroundSound: any
  private loop: any

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
    // create svgElement
    this.svgElement = d3.select(this.svgContainer)
      .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight)

    this.backgroundSound = new Tone.Player({
      url: atmosphericDrone,
      autoStart: true,
      volume: -30,
      fadeIn: 2,
      fadeOut: 5,
      loop: true,
    }).toMaster()

    setTimeout(() => {
      this.control().start()
    }, 2000)

    // // TEMPORARY
    // data.forEach(event => {
    //   // TODO: Figure out how to import mp3s inline in loop
    //   // const { geo } = event.properties
    //   // console.log(process.env.PUBLIC_URL);
    //   // const filePath = `${process.env.PUBLIC_URL}/media/${geo.map.toLowerCase()}_${geo.location.toLowerCase()}/${stat.sound}`
    //   // const sound = require(filePath)
    //   this.createRippleWave(event.stats)
    // })
  }

  public control = () => {
    const { stats } = this.props.event.data
    return {
      start: () => {
        this.backgroundSound.start()
        this.createRippleWave(stats)
        this.loop.start(0)
      },
      stop: () => {
        this.createRippleWave(stats).destroy()
        this.backgroundSound.stop()
        this.loop.stop()
        this.loop.dispose()
      }
    }
  }

  componentWillUnmount() {
    this.control().stop()
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

    const defs = group.append('defs')
    const linearGradient = defs.append('linearGradient')
      .attr("id", "animate-gradient") //unique id to reference the gradient by
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0")
      .attr("spreadMethod", "reflect")

    const colours = ["#6911CB", "#2575FC", "#6911CB"]

    linearGradient.selectAll('.stop')
      .data(colours)
      .enter().append("stop")
      .attr("offset", (d, i) => i / (colours.length - 1))
      .attr("stop-color", d => d)

    linearGradient.append("animate")
      .attr("attributeName", "x1")
      .attr("values", "0%;100%")
      .attr("dur", "2s")
      .attr("repeatCount", "indefinite")

    linearGradient.append("animate")
      .attr("attributeName", "x2")
      .attr("values", "100%;200%")
      .attr("dur", "2s")
      .attr("repeatCount", "indefinite")

    const circles = group.append('circle')
    // d => d.id * 100
      .attr('r', 0)
      .attr('cx', window.innerWidth / 2)
      .attr('cy', window.innerHeight / 2)
      .attr('fill', 'none')
      .attr("stroke-opacity", 0)
      .attr('stroke-width', d => 10 / d.id)
      .style('stroke', 'url(#animate-gradient)')
      .transition()
        .duration(d => 1000 * d.id)
        .ease(d3.easeQuadIn)
        .delay(d => d.id * 500)
        .attr('r', d => d.id * 100)
        .attr("stroke-opacity", 1)

    stats.forEach(stat => {
      this.generateSound(stat.id)
    })

    return {
      destroy: () => {
        const now = Tone.now()
        this.svgElement.remove()
        Tone.Transport.stop(now)
      }
    }
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
        file = violin_as4
        volume = -30
        break
      case 3:
        file = viola_c5
        volume = -35
        break
      default:
        break
    }

    // const freeverb = new Tone.Freeverb(1, 1000).toMaster()
    const freeverb = new Tone.JCReverb(0.9).toMaster()
    const sound = new Tone.Player({
      url: file,
      autoStart: true,
      // volume: -1,
      volume: volume,
      retrigger: true,
      loop: false,
    }).fan(fft, waveform).connect(freeverb).toMaster()

    this.loop = new Tone.Loop({
      'callback': (time) => {
        const now = Tone.now()
        sound.start(now).stop(now + 5)
      },
      'interval': '4n',
      'probability': 0.001
    })

    // Find by id param in svgContainer
    const group = this.svgElement.selectAll('g')
      .filter(d => d.id === id)

    const circle = group.select('circle')

    group.append('text')
      .attr('transform', d => {
        const top = ((window.innerHeight / 2) - (100 * d.id)) + 50
        return `translate(${window.innerWidth / 2}, ${top})`
      })
      .attr('id', d => d.id)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', d => 12 + 'px')
      .attr('z-index', 1000)
      .attr('fill-opacity', 0)
      .attr('fill', '#6d98fc')
      .text(d => `0 ${d.type}`)
      .transition()
        .duration(d => 1000 * d.id)
        .ease(d3.easeQuadIn)
        .delay(d => d.id * 1000)
      .attr('fill-opacity', 1)

    const text = group.select('text')

    // This creates a circle that disappears after 2 seconds
    // const rippleCircles = group.append('circle')
    //   .classed('.innerCircles', true)
    //   .attr("cx", window.innerWidth / 2)
    //   .attr("cy", window.innerHeight / 2)
    //   .attr("r", 0)
    //   .attr('fill', 'none')
    //   .style("stroke-width", 1)
    //   .attr('stroke', 'white')
    //   .transition()
    //   .delay(Math.pow(2, 2.5) * 50)
    //   .duration(2000)
    //   .ease(d3.easeQuadIn)
    //   .attr("r", 100)
    //   .style("stroke-opacity", 0)
    //   .on('end', () => {
    //     console.log('test')
    //   })

    /*
    * Schedule the Transport
    * This is the Tone.js equivalent of requestAnimationFrame
    * */

    let bob = 2
    let starter = 0
    Tone.Transport.schedule(() => {
      const frequencyData = waveform.getValue()
      const max: number = parseFloat(d3.max(frequencyData)) * 10000
      starter = max > 0 ? starter + 0.5 : starter

      const difference = d => (d.id * 100) + max

      circle.attr('r', d => difference(d))

      text.text(d => Math.round(starter / 100) + ` ${d.type}`)
        .attr('transform', d => {
          const top = (window.innerHeight / 2) + 50
          return `translate(${window.innerWidth / 2}, ${top - difference(d)})`
        })
    })

    // mouse events
    const handleRippleHoverIn = () => {
      Tone.Transport.pause()
      this.loop.stop()
    }

    const handleRippleHoverOut = () => {
      Tone.Transport.start()
      this.loop.start()
    }

    // events
    circle.on('mouseover', handleRippleHoverIn)
    circle.on('mouseout', handleRippleHoverOut)

    /*
    * Set Transport params
    * By setting loopEnd to 0 it runs like requestAnimationFrame
    *
    * Tone.Transport.loopStart = 0
    * Tone.Transport.loopEnd = 0
    * */
    Tone.Transport.loop = true

    /*
    * Send the transport with a 0.05s delay for syncing
    * */
    Tone.Transport.start('+0.05')

    // This starts all of them
    // setTimeout(() => sound.start(), 2000)
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
            <img src={CloseIcon}/>
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
