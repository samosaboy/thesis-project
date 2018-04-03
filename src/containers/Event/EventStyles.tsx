import {fonts, colors} from '../../constants'

const borderWidth = 7.5

export default {
  event: {
    width: window.innerWidth - (2*borderWidth),
    height: window.innerHeight - (2*borderWidth),
    borderWidth: borderWidth,
    borderStyle: 'solid',
  },
  header: {
    paddingTop: 20,
    position: 'absolute' as 'absolute',
    width: window.innerWidth,
    textAlign: 'center',
    zIndex: 9999,
  },
  geoText: {
    margin: 0,
    color: colors.eventHeadings,
    fontSize: fonts.title,
  },
  description: {
    color: colors.eventText,
    fontSize: fonts.description,
  },
  svgContainer: {
    width: window.innerWidth - (2*borderWidth),
    height: window.innerHeight - (2*borderWidth),
    position: 'absolute' as 'absolute',
    zIndex: 1,
  },
  close: {
    display: 'block',
    zIndex: 9999,
    position: 'absolute' as 'absolute',
    left: 20,
    transition: 'transform 0.5s',
  },
  toggleButton: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.eventHeadings,
    opacity: 0.5,
    transform: 'scale(0.8)',
  },
  toggleText: {
    color: colors.eventHeadings,
    fontSize: fonts.toggle,
    margin: 7,
  },
  mainBody: {
    color: colors.text,
    position: 'absolute' as 'absolute',
    top: window.innerHeight / 3,
    width: window.innerWidth,
    zIndex: 9999,
  },
  left: {
    width: window.innerWidth / 4,
    position: 'absolute' as 'absolute',
    zIndex: 9999,
    left: 50,
  },
  right: {
    textAlign: 'right',
    width: window.innerWidth / 4,
    position: 'absolute' as 'absolute',
    zIndex: 9999,
    right: 50,
  },
}
