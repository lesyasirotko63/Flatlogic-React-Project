import list from 'reducers/articles/articlesListReducers';
import form from 'reducers/articles/articlesFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
