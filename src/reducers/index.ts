import { combineReducers } from 'redux'
import threeData from './threeData'

export interface RootState {
  threeData: threeDataConfig
}

export default combineReducers<RootState>({
  threeData,
})
