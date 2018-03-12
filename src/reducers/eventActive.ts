import {handleActions} from 'redux-actions'
import * as Actions from '../constants/actions'

const initialState: eventActiveConfig = {
  data: []
}

export default handleActions<eventActiveConfig, eventActiveData>(
  {
    [Actions.EVENT_ACTIVE]: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
  },
  initialState
)
