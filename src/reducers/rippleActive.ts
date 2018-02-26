import { handleActions } from 'redux-actions'
import * as Actions from '../constants/actions'

/*
* This is the reducer for ripple Active which is
* what the user hovers over in our main stage
* */

const initialState: rippleActiveConfig = {
  title: '',
}

export default handleActions<rippleActiveConfig, helperData>(
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
