import { combineReducers, Reducer } from "redux"
import helper from './helper'
import rippleActive from './rippleActive'
import position from './position'
import eventActive from './eventActive'
import eventRippleActive from './eventRippleActive'

export interface RootState {
  helper: helperConfig,
  rippleActive: rippleActiveConfig
  position: pointerPositionConfig,
  eventActive: eventActiveConfig,
  eventRippleActive: eventRippleActiveConfig,
}

export default combineReducers<RootState>({
  helper,
  rippleActive,
  position,
  eventActive,
  eventRippleActive
})
