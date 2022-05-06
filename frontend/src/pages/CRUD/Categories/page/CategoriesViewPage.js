import React, { useEffect } from 'react';
import CategoriesWidget from 'pages/CRUD/Categories/page/CategoriesWidget';
import actions from 'actions/categories/categoriesFormActions';
import { connect } from 'react-redux';

const CategoriesViewPage = (props) => {
  const { dispatch, match, loading, record } = props;

  useEffect(() => {
    dispatch(actions.doFind(match.params.id));
  }, [match]);

  return (
    <React.Fragment>
      <CategoriesWidget loading={loading} record={record} />
    </React.Fragment>
  );
};

function mapStateToProps(store) {
  return {
    loading: store.users.form.loading,
    record: store.users.form.record,
  };
}

export default connect(mapStateToProps)(CategoriesViewPage);
