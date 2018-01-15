import { createAction } from "redux-actions"
import * as Actions from '../constants/actions'

export const addHelper = createAction<ContextualHelperData>(Actions.ADD_HELPER)
