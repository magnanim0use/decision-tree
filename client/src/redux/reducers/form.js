import {
  INIT_CREATE_NODE,
  CREATE_NODE,
  INIT_EDIT_NODE,
  EDIT_NODE,
  // DELETE_NODE,
  CLOSE_MODAL
} from '../actions/constants';

const MODES = {
  DEFAULT: null,
  CREATE: 'CREATE',
  EDIT: 'EDIT'
}

const initialState = {
    mode: MODES.DEFAULT,
    formData: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
      case INIT_CREATE_NODE: {
        return {
          ...state,
          mode: MODES.CREATE
        };
      }

      case INIT_EDIT_NODE: {
        return {
          ...state,
          mode: MODES.EDIT
        }
      }

      case EDIT_NODE: {
        const {
          id,
          name,
          description
        } = action.payload;

        return {
          ...state,
          mode: MODES.EDIT,
          formData: {
            id,
            name,
            description
          }
        };
      }

      case CREATE_NODE:
      case CLOSE_MODAL: {
        return {
          ...state,
          mode: MODES.DEFAULT
        }
      } 

    default:
      return state;
  }
}
