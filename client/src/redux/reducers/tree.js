import {
  INIT_CREATE_NODE,
  CREATE_NODE,
  INIT_EDIT_NODE,
  EDIT_NODE,
  DELETE_NODE,
  MOVE_NODE
} from '../actions/constants';

const initialState = {
    data: {
      id: 1,
      name: 'New Tree',
      children: []
    }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INIT_CREATE_NODE: {
      const { parentId } = action.payload;
      return {
        ...state
      };
    }

    case CREATE_NODE: {
      const { name } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          children: [
            {
              id: 2,
              name
            }
          ]
        }
      }
    }

    default:
      return state;
  }
}
