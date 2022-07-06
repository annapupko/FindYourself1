import { COUNT_UP1, COUNT_DOWN1 } from '../actions/Types';

const initialState = {
  count1: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case COUNT_UP1:
      return { ...state, count1: state.count1 + 1 };
    case COUNT_DOWN1:
      return { ...state, count1: state.count1 - 1 };

    default:
      return state;
  }
};
