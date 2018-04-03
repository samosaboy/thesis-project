import { createAction } from 'redux-actions'
import * as Actions from '../constants/actions'

// Mouse Event Stuff
export const addMouseEvent = createAction<mouseDataConfig>(Actions.ADD_MOUSE_EVENT)
export const resetMouseEvent = createAction<mouseDataConfig>(Actions.RESET_MOUSE_EVENT)
export const addLastHoveredObject = createAction<mouseDataConfig>(Actions.ADD_LAST_HOVERED_OBJ)
