import { handleActions } from 'redux-actions'
import * as Actions from '../constants/actions'

const initialState: sceneDataIndex | any = {
  currentScene: {},
  scenes: [],
}

export default handleActions<any, any>(
  {
    [Actions.SCENE_ADD]: (state, action) => {
      return {
        ...state,
        scenes: [
          ...state.scenes,
          action.payload.scene,
        ],
      }
    },
    [Actions.SCENE_SET_CURRENT]: (state, action) => {
      const currentScene = state.scenes.filter(scene => action.payload.name === scene.name)[0]
      return {
        ...state,
        currentScene,
      }
    },
  },
  initialState
)
