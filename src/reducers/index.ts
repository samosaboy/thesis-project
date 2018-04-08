import { combineReducers } from 'redux'
import mouseData from './mouseData'

export interface RootState {
  mouseData: mouseDataConfig,
}

export default combineReducers<RootState>({
  mouseData,
})
