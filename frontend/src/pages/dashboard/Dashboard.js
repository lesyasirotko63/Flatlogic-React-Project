import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { CircularProgress, Box } from '@material-ui/core';
import reactLogo from '../../images/react-logo.svg';
import {
  useManagementDispatch,
  useManagementState,
} from '../../context/ManagementContext';
// components
import Widget from '../../components/Widget';

const Dashboard = () => {
  const managementDispatch = useManagementDispatch();
  const managementValue = useManagementState();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(managementValue.currentUser);
  }, [managementDispatch, managementValue]);

  if (!currentUser) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <h1 className='page-title'>
        Welcome, {currentUser.firstName}! <br />
        <small>
          <small>Your role is {currentUser.role}</small>
        </small>
      </h1>
      <Row>
        <Col lg={6}>
          <Widget>
            <Row className={'align-items-center'}>
              <Col md={6}>
                <img src={reactLogo} alt='react' />
              </Col>
            </Row>
          </Widget>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
