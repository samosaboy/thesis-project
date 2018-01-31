import { handleActions } from 'redux-actions'
import * as Actions from '../constants/actions'

const initialState: rippleEventActiveConfig = {
  title: '',
  description: '',
  visual: null,
}

export default handleActions<rippleEventActiveConfig, ContextualHelperData>(
  {
    [Actions.EVENT_RIPPLE_ACTIVE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    }
  },
  initialState
)
