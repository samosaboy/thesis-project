import { combineReducers, Reducer } from "redux"
import helper from './helper'
import rippleActive from './rippleActive'
import position from './position'
import eventRippleActive from './eventRippleActive'

export interface RootState {
  helper: HelperStateConfig,
  rippleActive: rippleActiveConfig
  position: pointerPosition,
  eventRippleActive: rippleEventActiveConfig,
}

export default combineReducers<RootState>({
  helper,
  rippleActive,
  position,
  eventRippleActive,
})
