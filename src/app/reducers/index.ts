import { combineReducers } from 'redux'
import sceneData from './sceneData'

export interface RootState {
  sceneData: any,
}

export default combineReducers<RootState>({
  sceneData,
})
