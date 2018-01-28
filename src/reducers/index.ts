import { combineReducers, Reducer } from "redux"
import helper from './helper'
import rippleActive from './rippleActive'
import position from './position'

export interface RootState {
  helper: HelperStateConfig,
  rippleActive: rippleActiveConfig
  position: pointerPosition,
}

export default combineReducers<RootState>({
  helper,
  rippleActive,
  position,
})
