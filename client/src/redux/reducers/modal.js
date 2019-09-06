import {
  INIT_CREATE_NODE,
  CREATE_NODE,
  INIT_EDIT_NODE,
  // EDIT_NODE,
  // DELETE_NODE,
  CLOSE_MODAL
} from '../actions/constants';

const CONSTANTS = {
  DEFAULT: null,
  CREATE: 'CREATE',
  EDIT: 'EDIT'
}

const initialState = {
    mode: null,
    modalIsOpen: false,
    shouldCloseOnOverlayClick: true,
    formData: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INIT_CREATE_NODE: {
      return {
        ...state,
        mode: CONSTANTS.CREATE,
        modalIsOpen: true
      };
    }

    case INIT_EDIT_NODE: {
      return {
        ...state,
        mode: CONSTANTS.EDIT,
        modalIsOpen: true
      }
    }

    case CREATE_NODE:
    case CLOSE_MODAL: {
      return {
        ...state,
        mode: CONSTANTS.DEFAULT,
        modalIsOpen: false
      }
    } 

    default:
      return state;
  }
}
