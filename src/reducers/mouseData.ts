import { handleActions } from 'redux-actions'
import * as Actions from '../constants/actions'

const initialState: mouseData = {
  event: '',
  object: null
}

export default handleActions<mouseDataConfig, mouseData>(
  {
    [Actions.ADD_MOUSE_EVENT]: (state, action) => {
      return {
        ...state,
        event: action.payload.event,
        object: action.payload.object,
      }
    },
    [Actions.RESET_MOUSE_EVENT]: () => {
      return {
        ...initialState
      }
    },
    [Actions.ADD_LAST_HOVERED_OBJ]: (state, action) => {
      return {
        ...state,
        object: action.payload.object,
      }
    },
  },
  initialState,
)
