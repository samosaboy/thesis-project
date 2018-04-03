import { createAction } from 'redux-actions'
import * as Actions from '../constants/actions'

// THREE stuff
export const addThreeAnimate = createAction<threeDataConfig>(Actions.THREE_ANIMATE_ADD)
