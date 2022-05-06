import list from 'reducers/categories/categoriesListReducers';
import form from 'reducers/categories/categoriesFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
