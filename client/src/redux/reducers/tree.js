import { 
  ADD_NODE 
} from "../actions/constants";

const initialState = {
  nodes: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_NODE: {
      const { content } = action.payload;
      return {
        ...state,
        nodes: [
          ...state.nodes,
          content
        ]
      };
    }

    default:
      return state;
  }
}
