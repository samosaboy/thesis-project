import { handleActions } from "redux-actions"
import * as Actions from '../constants/actions'

const initialState: HelperStateConfig = {
  text: 'Use your mouse to scroll around',
  persistent: false
}

export default handleActions<HelperStateConfig, ContextualHelperData>(
  {
    [Actions.ADD_HELPER]: (state, action) => {
      return {
        ...action.payload,
        ...state
      }
    }
  },
  initialState
)
