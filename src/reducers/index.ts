import { combineReducers, Reducer } from "redux"
import helper from './helper'

export interface RootState {
  helper: HelperStateConfig
}

export default combineReducers<RootState>({
  helper
})
