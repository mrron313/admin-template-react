import React, { useState, useEffect } from 'react';

import StoreOrderComponent from '../../components/OrderComponent/StoreOrders';

import {
  Container,
  Row,
} from "react-bootstrap";

function StoreOrders() {
  return (
    <Container fluid>
      <Row>
        <StoreOrderComponent />
      </Row>
    </Container>
  );
}

export default StoreOrders;
