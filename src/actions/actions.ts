import { createAction } from 'redux-actions'
import * as Actions from '../constants/actions'

/*
 * Mouse Event Tracker
 * Keeps up with the THREE.Raycaster in index.tsx
 * */
export const addMouseEvent = createAction<mouseDataConfig>(Actions.MOUSE_EVENT_ADD)
export const resetMouseEvent = createAction<mouseDataConfig>(Actions.MOUSE_EVENT_RESET)
export const addLastHoveredObject = createAction<mouseDataConfig>(Actions.MOUSE_EVENT_LAST_HOVERED_OBJECT)
