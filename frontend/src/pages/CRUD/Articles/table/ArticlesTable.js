// eslint-disable-next-line
import * as dataFormat from 'pages/CRUD/Articles/table/ArticlesDataFormatters';

// eslint-disable-next-line
import * as usersDataFormat from 'pages/CRUD/Users/table/UsersDataFormatters';
// eslint-disable-next-line
import * as categoriesDataFormat from 'pages/CRUD/Categories/table/CategoriesDataFormatters';
// eslint-disable-next-line
import * as tagsDataFormat from 'pages/CRUD/Tags/table/TagsDataFormatters';

import actions from 'actions/articles/articlesListActions';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { uniqueId } from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import { makeStyles } from '@material-ui/styles';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
  Form,
  FormGroup,
  Input,
  Label,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Widget from 'components/Widget';
import Actions from '../../../../components/Table/Actions';

const styles = (theme) => ({});

const ArticlesTable = ({ classes }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [width, setWidth] = React.useState(window.innerWidth);

  const [filters, setFilters] = React.useState([
    { label: 'Title', title: 'title' },
    { label: 'Body', title: 'body' },

    { label: 'Author', title: 'author' },
    { label: 'Category', title: 'category' },
  ]);

  const [filterItems, setFilterItems] = React.useState([]);
  const [filterUrl, setFilterUrl] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [sortModel, setSortModel] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);

  const count = useSelector((store) => store.articles.list.count);
  const modalOpen = useSelector((store) => store.articles.list.modalOpen);
  const rows = useSelector((store) => store.articles.list.rows);
  const idToDelete = useSelector((store) => store.articles.list.idToDelete);

  const [rowsState, setRowsState] = React.useState({
    page: 0,
    pageSize: 5,
  });

  React.useEffect(async () => {
    setLoading(true);
    await dispatch(
      actions.doFetch({
        limit: rowsState.pageSize,
        page: rowsState.page,
        orderBy: sortModel[0],
        request: filterUrl,
      }),
    );
    setLoading(false);
  }, [sortModel, rowsState]);

  React.useEffect(() => {
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  const handleSortModelChange = (newModel) => {
    setSortModel(newModel);
  };

  const updateWindowDimensions = () => {
    setWidth(window.innerWidth);
  };

  const handleChange = (id) => (e) => {
    const value = e.target.value;
    const name = e.target.name;

    const index = filterItems.findIndex((item) => item.id === id);
    let obj = filterItems[index];
    obj.fields[name] = value;
    obj.id = id;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let request = '&';
    filterItems.forEach((item) => {
      filters[
        filters.map((filter) => filter.title).indexOf(item.fields.selectedField)
      ].hasOwnProperty('number')
        ? (request += `${item.fields.selectedField}Range=${item.fields.filterValueFrom}&${item.fields.selectedField}Range=${item.fields.filterValueTo}&`)
        : (request += `${item.fields.selectedField}=${item.fields.filterValue}&`);
    });

    dispatch(
      actions.doFetch({
        limit: rowsState.pageSize,
        page: 0,
        orderBy: sortModel[0],
        request,
      }),
    );
    setFilterUrl(request);
  };

  const handleReset = () => {
    setFilterItems([]);
    setFilterUrl('');
    dispatch(
      actions.doFetch({ limit: rowsState.pageSize, page: 0, request: '' }),
    );
  };

  const addFilter = () => {
    let newItem = {
      id: uniqueId(),
      fields: {
        filterValue: '',
        filterValueFrom: '',
        filterValueTo: '',
      },
    };
    newItem.fields.selectedField = filters[0].title;
    setFilterItems([...filterItems, newItem]);
  };

  const deleteFilter = (value) => (e) => {
    e.preventDefault();
    const newItems = filterItems.filter((item) => item.id !== value);
    if (newItems.length) {
      setFilterItems(newItems);
    } else {
      dispatch(actions.doFetch({ limit: 10, page: 1 }));
      setFilterItems(newItems);
    }
  };

  const handleDelete = () => {
    dispatch(
      actions.doDelete({ limit: 10, page: 0, request: filterUrl }, idToDelete),
    );
  };

  const openModal = (event, cell) => {
    const id = cell;
    event.stopPropagation();
    dispatch(actions.doOpenConfirm(id));
  };

  const closeModal = () => {
    dispatch(actions.doCloseConfirm());
  };

  const columns = [
    {
      field: 'title',
      flex: 1,

      headerName: 'Title',
    },

    {
      field: 'body',
      flex: 1,

      headerName: 'Body',
    },

    {
      field: 'author',
      flex: 1,

      renderCell: (params) =>
        usersDataFormat.listFormatter(
          params.row[params.field],
          history,
          'users',
        ),

      headerName: 'Author',
    },

    {
      field: 'category',
      flex: 1,

      renderCell: (params) =>
        categoriesDataFormat.listFormatter(
          params.row[params.field],
          history,
          'categories',
        ),

      headerName: 'Category',
    },

    {
      field: 'tags',
      flex: 1,

      renderCell: (params) =>
        tagsDataFormat.listFormatter(params.row[params.field], history, 'tags'),

      headerName: 'Tags',
    },

    {
      field: 'featured',
      flex: 1,

      renderCell: (params) => dataFormat.booleanFormatter(params.row),

      headerName: 'Featured',
    },

    {
      field: 'images',
      flex: 1,

      sortable: false,
      renderCell: (params) => dataFormat.imageFormatter(params.row),

      headerName: 'Images',
    },

    {
      field: 'id',
      headerName: 'Actions',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Actions
          classes={classes}
          entity='articles'
          openModal={openModal}
          {...params}
        />
      ),
    },
  ];

  return (
    <div>
      <Widget title={<h4>Articles</h4>} disableWidgetMenu>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            className='btn btn-primary ml-3'
            type='button'
            onClick={addFilter}
          >
            Add Filter
          </button>
          <Link to='/admin/articles/new'>
            <Button variant='contained'>New</Button>
          </Link>
        </Box>

        <Form onSubmit={(e) => handleSubmit(e)}>
          {filterItems.map((item) => (
            <Row form className='mt-3' key={item.id}>
              <Col xs={4} md={4} lg={3}>
                <FormGroup>
                  <Label for='selectedField'>Field</Label>
                  <Input
                    type='select'
                    name='selectedField'
                    id='selectedField'
                    defaultValue={item.fields.selectedField}
                    onChange={handleChange(item.id)}
                  >
                    {filters.map((selectOption) => (
                      <option
                        key={selectOption.title}
                        value={`${selectOption.title}`}
                      >
                        {selectOption.label}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              <Col xs={4} md={4} lg={3} className='ml-0 ml-md-4'>
                {filters[
                  filters
                    .map((filter) => filter.title)
                    .indexOf(item.fields.selectedField)
                ].hasOwnProperty('number') ? (
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label for='filterValueFrom'>From</Label>
                        <Input
                          type='text'
                          defaultValue={item.fields.filterValueFrom}
                          name='filterValueFrom'
                          id='filterValueFrom'
                          onChange={handleChange(item.id)}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for='filterValueTo'>To</Label>
                        <Input
                          type='text'
                          defaultValue={item.fields.filterValueTo}
                          name='filterValueTo'
                          id='filterValueTo'
                          onChange={handleChange(item.id)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                ) : (
                  <>
                    <FormGroup>
                      <Label for='filterValue'>Contains</Label>
                      <Input
                        type='text'
                        defaultValue={item.fields.filterValue}
                        name='filterValue'
                        id='filterValue'
                        onChange={handleChange(item.id)}
                      />
                    </FormGroup>
                  </>
                )}
              </Col>
              <Col xs={3} md={3} lg={2} className='align-self-center'>
                <button
                  className='btn btn-danger ml-3 mt-2'
                  onClick={deleteFilter(item.id)}
                >
                  Delete
                </button>
              </Col>
            </Row>
          ))}
          {filterItems.length > 0 && (
            <Row>
              <Col xs={12} lg={3} className='align-self-end mb-3'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  value='Submit'
                >
                  Apply
                </button>
                <button
                  type='reset'
                  className='btn btn-danger ml-3'
                  value='Reset'
                  onClick={handleReset}
                >
                  Clear
                </button>
              </Col>
            </Row>
          )}
        </Form>

        <div
          style={{
            height: 500,
            width: '100%',
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            sortingMode='server'
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            rowsPerPageOptions={[5, 10, 20]}
            pageSize={5}
            pagination
            {...rowsState}
            rowCount={count}
            paginationMode='server'
            onPageChange={(page) => {
              setRowsState((prev) => ({ ...prev, page }));
            }}
            onPageSizeChange={(pageSize) => {
              setRowsState((prev) => ({ ...prev, pageSize }));
            }}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            checkboxSelection
            disableSelectionOnClick
            disableColumnMenu
            loading={loading}
          />
        </div>

        <div>
          <a
            href={
              process.env.NODE_ENV === 'production'
                ? window.location.origin + '/api-docs/#/Articles'
                : 'http://localhost:8080/api-docs/#/Articles'
            }
          >
            API documentation for articles
          </a>
        </div>
      </Widget>

      <Modal size='sm' isOpen={modalOpen} toggle={() => closeModal()}>
        <ModalHeader toggle={() => closeModal()}>Confirm delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this item?</ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button color='error' onClick={() => handleDelete()}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(ArticlesTable);
