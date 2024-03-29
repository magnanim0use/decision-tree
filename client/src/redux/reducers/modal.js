import {
  INIT_CREATE_NODE,
  CREATE_NODE,
  INIT_EDIT_NODE,
  EDIT_NODE,
  DELETE_NODE,
  CLOSE_MODAL
} from '../actions/constants';

const initialState = {
    modalIsOpen: false,
    shouldCloseOnOverlayClick: true
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INIT_CREATE_NODE: {
      return {
        ...state,
        modalIsOpen: true
      };
    }

    case INIT_EDIT_NODE: {
      return {
        ...state,
        modalIsOpen: true
      }
    }

    case CREATE_NODE:
    case EDIT_NODE:
    case DELETE_NODE:
    case CLOSE_MODAL: {
      return {
        ...state,
        modalIsOpen: false
      }
    } 

    default:
      return state;
  }
}
