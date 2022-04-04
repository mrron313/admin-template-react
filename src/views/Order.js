import React from 'react';
import { useHistory } from 'react-router-dom';
import JSONPretty from 'react-json-pretty';
import {
  Button,
  Row,
  Col,
} from "react-bootstrap";

export default function Order() {
  const history = useHistory();
  let order_details = localStorage.getItem('order_details');
  order_details = JSON.parse(order_details);

  const goBack = () => {
    history.push('/admin/orders');
  }

  return (
    <>
      <Row>
        <Col md="3">
          <Button onClick={goBack}>Go Back to Orders</Button>
        </Col>
      </Row>
      <div className='store-item'>
        <JSONPretty 
          id="json-pretty" 
          data={order_details} 
          style={{fontSize: "1.1em"}} 
          mainStyle="padding:1.5em" 
          valueStyle="font-size:1.1em"
          space={4}
          >
        </JSONPretty>
      </div>
    </>
  );
}
