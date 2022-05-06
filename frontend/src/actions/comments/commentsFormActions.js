import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { toast } from 'react-toastify';

const actions = {
  doNew: () => {
    return {
      type: 'COMMENTS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'COMMENTS_FORM_FIND_STARTED',
      });

      axios.get(`/comments/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'COMMENTS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'COMMENTS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/comments'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'COMMENTS_FORM_CREATE_STARTED',
      });

      axios.post('/comments', { data: values }).then((res) => {
        dispatch({
          type: 'COMMENTS_FORM_CREATE_SUCCESS',
        });

        toast.success('Comments created');
        dispatch(push('/admin/comments'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'COMMENTS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'COMMENTS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/comments/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'COMMENTS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        toast.success('Profile updated');
      } else {
        toast.success('Comments updated');
        dispatch(push('/admin/comments'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'COMMENTS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
