import {handleActions} from 'redux-actions'
import * as Actions from '../constants/actions'

const initialState: threeDataConfig = {
  data: [],
}

export default handleActions<threeDataConfig, threeData>(
  {
    [Actions.THREE_ANIMATE_ADD]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
  initialState
)
