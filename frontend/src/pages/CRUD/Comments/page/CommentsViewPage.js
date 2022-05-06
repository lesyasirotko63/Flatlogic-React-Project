import React, { useEffect } from 'react';
import CommentsWidget from 'pages/CRUD/Comments/page/CommentsWidget';
import actions from 'actions/comments/commentsFormActions';
import { connect } from 'react-redux';

const CommentsViewPage = (props) => {
  const { dispatch, match, loading, record } = props;

  useEffect(() => {
    dispatch(actions.doFind(match.params.id));
  }, [match]);

  return (
    <React.Fragment>
      <CommentsWidget loading={loading} record={record} />
    </React.Fragment>
  );
};

function mapStateToProps(store) {
  return {
    loading: store.users.form.loading,
    record: store.users.form.record,
  };
}

export default connect(mapStateToProps)(CommentsViewPage);
