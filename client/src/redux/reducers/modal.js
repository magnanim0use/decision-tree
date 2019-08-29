import {
  INIT_CREATE_NODE,
  CREATE_NODE,
  INIT_EDIT_NODE,
  EDIT_NODE,
  DELETE_NODE,
  MOVE_NODE
} from "../actions/constants";

const initialState = {
    modalIsOpen: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INIT_CREATE_NODE: {
      // const { parentId } = action.payload;
      return {
        ...state,
        modalIsOpen: true
      };
    }

    default:
      return state;
  }
}
