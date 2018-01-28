import {handleActions} from 'redux-actions'
import * as Actions from '../constants/actions'

const initialState: pointerPosition = {
  x: 0,
  y: 0,
}

export default handleActions<pointerPosition, pointerPositionData>(
  {
    [Actions.POSITION_SET]: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
  },
  initialState
)
