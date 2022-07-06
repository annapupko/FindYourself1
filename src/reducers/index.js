import { combineReducers } from 'redux';
import counterReducer from './CounterReducer';
import UserReducer from './UserReducer';

export default combineReducers({
  counters: counterReducer,
  user: UserReducer,
});
