import { combineReducers } from 'redux'
import mouseData from './mouseData'
import sceneData from './sceneData'

export interface RootState {
  mouseData: mouseDataConfig,
  sceneData: any,
}

export default combineReducers<RootState>({
  mouseData,
  sceneData,
})
