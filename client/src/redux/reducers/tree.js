import {
  INIT_CREATE_NODE,
  CREATE_NODE,
  INIT_EDIT_NODE,
  EDIT_NODE,
  DELETE_NODE,
  MOVE_NODE
} from '../actions/constants';

const CONSTANTS = {
  PENDING: 'PENDING',
  CREATE: 'CREATE',
  EDITING: 'EDIT',
  MOVING: 'MOVE',
  DELETING: 'DELETE'
};

export default function (state = initialState, action) {
  switch (action.type) {  
    case INIT_CREATE_NODE: {
      const { parentId } = action.payload;

      return {
        ...state,
        activeNode: {
          status: CONSTANTS.PENDING,
          parentId
        }
      }
    }

    case CREATE_NODE: {
      const { parentId } = action.payload;
      return {
        ...state,
        activeNode: {
          ...state.activeNode,
          status: CONSTANTS.CREATE
        }
      }
    }

    case MOVE_NODE: {
      return {
        ...state
      }
    }

    default:
      return state;
  }
}

const initialState = {   
    "activeNode": null,
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
