import { SET_USER, LOGOUT } from '../actions/Types';

const initialState = {
  user: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case LOGOUT:
      return { ...state, ...initialState };
    default:
      return state;
  }
};
