import React from 'react';
import { useHistory } from 'react-router-dom';
import JSONPretty from 'react-json-pretty';
import {   
  Button,
  Row,
  Col, 
} from 'react-bootstrap';

export default function User() {
  const history = useHistory();
  let user_details = localStorage.getItem('user_details');
  user_details = JSON.parse(user_details);

  const goBack = () => {
    history.push('/admin/users');
  }

  return (
    <>
      <Row>
        <Col md="3">
          <Button onClick={goBack}>Go Back to Users</Button>
        </Col>
      </Row>
      <div className='store-item'>
        <JSONPretty 
          id="json-pretty" 
          data={user_details} 
          style={{fontSize: "1.1em"}} 
          mainStyle="padding:1.5em" 
          valueStyle="font-size:1.1em"
          space={6}
          >
        </JSONPretty>
      </div>
    </>
  );
}
