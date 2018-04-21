import { createAction } from 'redux-actions'
import * as Actions from '../constants/actions'

/*
 * Scene List Tracker
 * Add and index scenes for setting
 * */
export const addToSceneList = createAction<sceneDataAddConfig>(Actions.SCENE_ADD)
export const setCurrentScene = createAction<sceneDataSetCurrentConfig>(Actions.SCENE_SET_CURRENT)
export const sceneSetComplete = createAction<sceneDataSetCurrentCompleteConfig>(Actions.SCENE_SET_COMPLETE)
