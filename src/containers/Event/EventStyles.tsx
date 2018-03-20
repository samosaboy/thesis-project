import {fonts, colors} from "../../constants";

const borderWidth = 7.5

export default {
  event: {
    width: window.innerWidth - (2*borderWidth),
    height: window.innerHeight - (2*borderWidth),
    backgroundColor: colors.darkBlue,
    borderColor: colors.mutedDarkBlue,
    borderWidth: borderWidth,
    borderStyle: 'solid'
  },
  header: {
    paddingTop: 20,
    position: 'absolute' as 'absolute',
    width: window.innerWidth,
    textAlign: 'center',
  },
  geoText: {
    margin: 0,
    color: colors.eventHeadings,
    fontSize: fonts.title
  },
  description: {
    color: colors.eventText,
    fontSize: fonts.description
  },
  svgContainer: {
    width: window.innerWidth,
    height: window.innerHeight,
    position: 'absolute' as 'absolute',
    zIndex: 999
    // left: window.innerWidth / 3.4,
    // top: window.innerHeight / 4
  },
  close: {
    display: 'block',
    zIndex: 9999,
    position: 'absolute' as 'absolute',
    left: 20,
    transition: 'transform 0.5s',
  }
}
