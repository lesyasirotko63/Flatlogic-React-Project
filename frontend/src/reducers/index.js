import auth from 'reducers/auth';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import users from 'reducers/users/usersReducers';

import tags from 'reducers/tags/tagsReducers';

import articles from 'reducers/articles/articlesReducers';

import categories from 'reducers/categories/categoriesReducers';

import comments from 'reducers/comments/commentsReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,

    users,

    tags,

    articles,

    categories,

    comments,
  });
