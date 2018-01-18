import { handleActions } from "redux-actions"
import * as Actions from '../constants/actions'

const initialState: rippleActiveConfig = {
  title: '',
  description: ''
}

export default handleActions<rippleActiveConfig, ContextualHelperData>(
  {
    [Actions.RIPPLE_ACTIVE]: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    }
  },
  initialState
)
