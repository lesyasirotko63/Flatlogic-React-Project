import list from 'reducers/comments/commentsListReducers';
import form from 'reducers/comments/commentsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
