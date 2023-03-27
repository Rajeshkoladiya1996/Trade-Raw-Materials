import { STORE_USER_DATA } from "./../constants";

const initialState = {
  user: {},
};

export const authenticateReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_USER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default authenticateReducer;
