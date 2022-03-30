import React, { useState, useEffect } from "react";

import OrderComponent from '../components/OrderComponent/index.js';

import {
  Container,
  Row,
} from "react-bootstrap";

function Orders() {
  return (
    <Container fluid>
      <Row>
        <OrderComponent />
      </Row>
    </Container>
  );
}

export default Orders;
