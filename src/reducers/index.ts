import { combineReducers, Reducer } from "redux"
import helper from './helper'
import rippleActive from './rippleActive'

export interface RootState {
  helper: HelperStateConfig,
  rippleActive: rippleActiveConfig
}

export default combineReducers<RootState>({
  helper,
  rippleActive
})
