import { handleActions } from 'redux-actions'
import * as Actions from '../constants/actions'

const initialState: rippleEventActiveConfig = {
  title: '',
  description: '',
  map: null,
  visual: null,
}

export default handleActions<rippleEventActiveConfig, ContextualHelperData>(
  {
    [Actions.EVENT_RIPPLE_ACTIVE]: (state, action) => {
      console.log(action)
      return {
        ...state,
        ...action.payload,
      }
    }
  },
  initialState
)
