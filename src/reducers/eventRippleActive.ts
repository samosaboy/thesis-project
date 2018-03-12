import {handleActions} from "redux-actions"
import * as Actions from '../constants/actions'

const initialState: eventRippleActiveConfig = {
  ripple: null
}

export default handleActions<eventRippleActiveConfig, eventRippleActiveData>(
  {
    [Actions.EVENT_RIPPLE_ACTIVE]: (state, action) => {
      console.log(action.payload)
      return {
        ...state,
        ...action.payload,
      }
    },
  },
  initialState
)
