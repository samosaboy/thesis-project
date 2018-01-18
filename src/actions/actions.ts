import { createAction } from "redux-actions"
import * as Actions from '../constants/actions'

export const rippleActive = createAction<rippleActiveData>(Actions.RIPPLE_ACTIVE)
export const addHelper = createAction<ContextualHelperData>(Actions.ADD_HELPER)
