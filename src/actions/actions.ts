import { createAction } from 'redux-actions'
import * as Actions from '../constants/actions'

// Main Stage Actions
export const rippleActive = createAction<rippleActiveConfig>(Actions.RIPPLE_ACTIVE)

// Event View Actions
export const eventActive = createAction<eventActiveConfig>(Actions.EVENT_ACTIVE)
export const eventRippleActive = createAction<eventRippleActiveConfig>(Actions.EVENT_RIPPLE_ACTIVE)

// Util Actions
export const addHelper = createAction<helperConfig>(Actions.HELPER_ADD)
export const positionSet = createAction<pointerPositionConfig>(Actions.POSITION_SET)
