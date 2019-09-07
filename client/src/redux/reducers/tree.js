import {
  INIT_CREATE_NODE,
  CREATE_NODE,
  INIT_EDIT_NODE,
  // EDIT_NODE,
  // DELETE_NODE,
  MOVE_NODE
} from '../actions/constants';

const CONSTANTS = {
  PENDING_CREATE: 'PENDING',
  CREATE: 'CREATE',
  PENDING_EDIT: 'PENDING_EDIT',
  EDIT: 'EDIT',
  MOVE: 'MOVE',
  DELETE: 'DELETE'
};

export default function (state = initialState, action) {
  switch (action.type) {  
    case INIT_CREATE_NODE: {
      const { parentId } = action.payload;

      return {
        ...state,
        shouldUpdate: false,
        activeNode: {
          status: CONSTANTS.PENDING,
          parentId
        }
      }
    }

    case INIT_EDIT_NODE: {
      const { 
        id,
        name,
        description 
      } = action.payload; 

      return {
        ...state,
        shouldUpdate: false,
        activeNode: {
          id,
          status: CONSTANTS.PENDING_EDIT
        }
      }
    }

    case CREATE_NODE: {
      return {
        ...state,
        shouldUpdate: true,
        activeNode: {
          ...state.activeNode,
          status: CONSTANTS.CREATE
        }
      }
    }

    case MOVE_NODE: {
      const { id } = action.payload;

      return {
        ...state,
        shouldUpdate: true,
        activeNode: {
          id,
          status: CONSTANTS.MOVE
        }
      }
    }

    default:
      return state;
  }
}

const initialState = {   
    "activeNode": null,
    "shouldUpdate": true,
    "data": {
      "name": "A",
      "id": 1,
      "children": [
        { 
            "name": "B",
            "id": 2
        },
        {
          "name": "C",
          "id": 3,
          "children": [
              { 
                  "name": "D",
                  "id": 4
              }, 
              { 
                  "name": "E",
                  "id": 5
              }, 
              { 
                  "name": "F",
                  "id": 7 
              }
            ]
        },
        { 
            "name": "G",
            "id": 6
        },
        {
            "name": "H",
            "id": 10,
            "children": [
              { 
                  "name": "I",
                  "id": 9
              }, 
              { 
                  "name": "J",
                  "id": 11 
              }
            ]
        },
        { 
            "name": "K",
            "id": 8
        }
      ]
    }
}
