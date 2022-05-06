import React, { useEffect } from 'react';
import ArticlesWidget from 'pages/CRUD/Articles/page/ArticlesWidget';
import actions from 'actions/articles/articlesFormActions';
import { connect } from 'react-redux';

const ArticlesViewPage = (props) => {
  const { dispatch, match, loading, record } = props;

  useEffect(() => {
    dispatch(actions.doFind(match.params.id));
  }, [match]);

  return (
    <React.Fragment>
      <ArticlesWidget loading={loading} record={record} />
    </React.Fragment>
  );
};

function mapStateToProps(store) {
  return {
    loading: store.users.form.loading,
    record: store.users.form.record,
  };
}

export default connect(mapStateToProps)(ArticlesViewPage);
