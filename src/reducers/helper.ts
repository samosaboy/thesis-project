import {handleActions} from 'redux-actions'
import * as Actions from '../constants/actions'

const initialState: HelperStateConfig = {
  text: 'Left-click to drag around',
  persistent: false,
}

export default handleActions<HelperStateConfig, ContextualHelperData>(
  {
    [Actions.HELPER_ADD]: (state, action) => {
      return {
        ...state,
        ...action.payload && {...action.payload},
        ...!action.payload.text && {text: 'Left-click to drag around'}
      }
    },
  },
  initialState
)
