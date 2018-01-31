import { createAction } from 'redux-actions'
import * as Actions from '../constants/actions'

export const rippleActive = createAction<rippleActiveData>(Actions.RIPPLE_ACTIVE)
export const addHelper = createAction<ContextualHelperData>(Actions.HELPER_ADD)
export const positionSet = createAction<pointerPosition>(Actions.POSITION_SET)
export const eventRippleActive = createAction<eventRippleActiveData>(Actions.EVENT_RIPPLE_ACTIVE)
