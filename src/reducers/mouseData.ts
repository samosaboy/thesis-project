import { handleActions } from 'redux-actions'
import * as Actions from '../constants/actions'

const initialState: mouseData = {
  event: '',
  object: null,
}

export default handleActions<mouseDataConfig, mouseData>(
  {
    [Actions.MOUSE_EVENT_ADD]: (state, action) => {
      return {
        ...state,
        event: action.payload.event,
        object: action.payload.object,
      }
    },
    [Actions.MOUSE_EVENT_RESET]: () => {
      return {
        ...initialState,
      }
    },
    [Actions.MOUSE_EVENT_LAST_HOVERED_OBJECT]: (state, action) => {
      return {
        ...state,
        object: action.payload.object,
      }
    },
  },
  initialState,
)
