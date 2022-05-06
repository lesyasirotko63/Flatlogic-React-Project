import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { toast } from 'react-toastify';

const actions = {
  doNew: () => {
    return {
      type: 'ARTICLES_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'ARTICLES_FORM_FIND_STARTED',
      });

      axios.get(`/articles/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'ARTICLES_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ARTICLES_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/articles'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'ARTICLES_FORM_CREATE_STARTED',
      });

      axios.post('/articles', { data: values }).then((res) => {
        dispatch({
          type: 'ARTICLES_FORM_CREATE_SUCCESS',
        });

        toast.success('Articles created');
        dispatch(push('/admin/articles'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ARTICLES_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'ARTICLES_FORM_UPDATE_STARTED',
      });

      await axios.put(`/articles/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'ARTICLES_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        toast.success('Profile updated');
      } else {
        toast.success('Articles updated');
        dispatch(push('/admin/articles'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ARTICLES_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
