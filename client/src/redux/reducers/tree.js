import {
  INIT_CREATE_NODE,
  CREATE_NODE,
  INIT_EDIT_NODE,
  EDIT_NODE,
  DELETE_NODE,
  MOVE_NODE
} from '../actions/constants';

import {
  findNodeById
} from '../../helpers';

const initialState = {
    data: {
      id: 1,
      name: 'New Tree',
      children: []
    }
};

export default function (state = initialState, action) {
  switch (action.type) {  
    case CREATE_NODE: {
      // const { name, parentId } = action.payload;
      // // need to access tree data below to find correct id
      // // id should be automatically generated
      //   // will be helper fx to find max id and ++ [v0]
      //   // server side call should find max and generate new node in db [v1]
      // const parentNode = findNodeById(state, parentId);
      // const newNode = {
      //   id: 100,
      //   name
      // };

      // parentNode.children && parentNode.children.length ? 
      //   parentNode.children.push(newNode) :
      //   parentNode.children = [ newNode ];

      return {
        ...state
      }
    }

    default:
      return state;
  }
}
