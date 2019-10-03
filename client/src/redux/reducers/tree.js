import {
  SHOW_NODE_OPTIONS,
  INIT_CREATE_NODE,
  CREATE_NODE,
  INIT_EDIT_NODE,
  EDIT_NODE,
  DELETE_NODE,
  INIT_MOVE_NODE,
  MOVE_NODE,
  TOGGLE_NODE
} from '../actions/constants';

const CONSTANTS = {
  SHOW_OPTIONS: 'SHOW_OPTIONS',
  PENDING_CREATE: 'PENDING',
  CREATE: 'CREATE',
  PENDING_EDIT: 'PENDING_EDIT',
  EDIT: 'EDIT',
  PENDING_MOVE: 'PENDING_MOVE',
  MOVE: 'MOVE',
  DELETE: 'DELETE',
  TOGGLE: 'TOGGLE'
};

export default function (state = initialState, action) {
  switch (action.type) {  
    case SHOW_NODE_OPTIONS: {
      const { 
        id,
        position
      } = action.payload;

      return {
        ...state,
        shouldUpdate: false,
        activeNode: {
          id,
          position,
          activeState: CONSTANTS.SHOW_OPTIONS
        }
      }
    }

    case INIT_CREATE_NODE: {
      const { parentId } = action.payload;

      return {
        ...state,
        shouldUpdate: false,
        activeNode: {
          activeState: CONSTANTS.PENDING,
          parentId
        }
      }
    }

    case INIT_EDIT_NODE: {
      const { 
        id,
        name,
        description,
        parentId 
      } = action.payload; 

      return {
        ...state,
        shouldUpdate: false,
        activeNode: {
          id,
          parentId,
          name,
          description,
          activeState: CONSTANTS.PENDING_EDIT
        }
      }
    }

    case CREATE_NODE: {
      const { id } = action.payload;

      return {
        ...state,
        shouldUpdate: true,
        activeNode: {
          ...state.activeNode,
          activeState: CONSTANTS.CREATE,
          id
        }
      }
    }

    case EDIT_NODE: {
      const {
        name,
        description,
        status
      } = action.payload;

      return {
        ...state,
        shouldUpdate: true,
        activeNode: {
          ...state.activeNode,
          activeState: CONSTANTS.EDIT,
          name,
          description,
          status
        }
      }
    }

    case INIT_MOVE_NODE: {
      const { id } = action.payload;

      return {
        ...state,
        shouldUpdate: false,
        activeNode: {
          id,
          activeState: CONSTANTS.PENDING_MOVE
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
          activeState: CONSTANTS.MOVE
        }
      }
    }

    case DELETE_NODE: {
     return {
        ...state,
        shouldUpdate: true,
        activeNode: {
          ...state.activeNode,
          activeState: CONSTANTS.DELETE
        }
      }
    }

    case TOGGLE_NODE: {
      const { id } = action.payload;

      return {
        ...state,
        shouldUpdate: true,
        activeNode: {
          id,
          activeState: CONSTANTS.TOGGLE
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
      "description": "Node A",
      "id": 1,
      "status": "INCLOMPLETE",
      "children": [
        { 
            "name": "B",
            "description": "Node B",
            "status": "INCLOMPLETE",
            "id": 2
        },
        {
          "name": "C",
          "description": "Node C",
          "status": "INCLOMPLETE",
          "id": 3,
          "children": [
              { 
                  "name": "D",
                  "description": "Node D",
                  "status": "INCLOMPLETE",
                  "id": 4
              }, 
              { 
                  "name": "E",
                  "description": "Node E",
                  "status": "INCLOMPLETE",
                  "id": 5
              }, 
              { 
                  "name": "F",
                  "description": "Node F",
                  "status": "INCLOMPLETE",
                  "id": 7 
              }
            ]
        },
        { 
            "name": "G",
            "description": "Node G",
            "status": "INCLOMPLETE",
            "id": 6
        },
        {
            "name": "H",
            "description": "Node H",
            "status": "INCLOMPLETE",
            "id": 10,
            "children": [
              { 
                  "name": "I",
                  "description": "Node I",
                  "status": "INCLOMPLETE",
                  "id": 9
              }, 
              { 
                  "name": "J",
                  "description": "Node J",
                  "status": "INCLOMPLETE",
                  "id": 11 
              }
            ]
        },
        { 
            "name": "K",
            "description": "Node K",
            "status": "INCLOMPLETE",
            "id": 8
        }
      ]
    }
}
