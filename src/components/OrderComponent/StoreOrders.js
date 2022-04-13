import React, { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';

import { Container, Row, Col, Button, Form, Spinner, Accordion } from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import AccordionContext from "react-bootstrap/AccordionContext";

import { putApiCall } from "Helpers/api";

import "bootstrap/dist/css/bootstrap.css";

const headers = { 
  'Content-Type': 'application/json'
};

function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  console.log(activeEventKey);

  return (
    <Button
      variant="primary"
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}

function StoreOrderComponent(props) {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const store_id = localStorage.getItem('store_id');

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const [dateCreatedNext, setDateCreatedNext] = useState(null);
  const [dateCreatedPrev, setDateCreatedPrev] = useState([null]);
  const [page, setPage] = useState(0);

  const handleOnClickNext = () => {
    setPage(page+1);
    let prevs = dateCreatedPrev;
    prevs.push(dateCreatedNext);
    setDateCreatedPrev(prevs);

    fetchOrders('next');
  };

  const handleOnClickPrev = () => {
    if (page>0) {
      let prevs = dateCreatedPrev;
      prevs.pop();
      let p = page - 1;

      setDateCreatedPrev(prevs);
      setPage(p);
      fetchOrders('prev', prevs, p);
    }
  };

  const fetchOrders = (type, prevs, p) => {
    setLoading(true);
    
    let data, url;

    data = {
      "store_id": store_id,
    }

    data = JSON.stringify(data);
    url = 'fetch_orders_from_store';

    headers.Authorization = `Bearer ${token}`; 

    putApiCall(url, 'put', headers, data).then((result) => {
      let ln = result.data.length;
      if (ln>0) {
        setDateCreatedNext(result.data[ln-1].date_created);
        setOrders(result.data);
        setLoading(false);
      } else {
        setLoading(false);
        setOrders([]);
      }
    });
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrders = (data) => {
    if (data.length === 0) return 'No orders found';

    return (
      <Accordion defaultActiveKey="0">
      {
        data.map((d, i) => {
          console.log(d);
          return (
            <div onClick={openOrder} style={{ cursor: 'pointer' }} className="store-item">
              <div>
                <table class="table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Store Name</th>
                      <th scope="col">Customer Phone Number</th>
                      <th scope="col">Total Amount</th>
                      <th scope="col">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">{d.order_id}</th>
                      <td>{d.customer_name}</td>
                      <td>{d.store_name}</td>
                      <td>{d.phonenumber}</td>
                      <td>{d.total_amount}</td>
                      <td><ContextAwareToggle eventKey={i}>Display Items</ContextAwareToggle></td>
                    </tr>
                    <tr>
                      <td colspan="6">
                        <Accordion.Collapse eventKey={i}>
                          <span>
                            {d.items.map(item => (
                              <>
                                <p>ITEMS</p>
                                <div style={{ cursor: 'pointer' }} className="store-item flex-div">
                                  <span className="flex-div-a">{ item.item_name } (Qty: {item.item_qty}) </span> 
                                  <span className="flex-div-b">${ item.item_price } </span> 
                                </div>
                              </>
                            ))}
                          </span>
                        </Accordion.Collapse>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      }
      </Accordion>
    )
  }

  const openOrder = (order_details) => {
    localStorage.setItem("order_details", JSON.stringify(order_details));
    history.push("/admin/order");
  };

  const goBack = () => {
    history.push('/admin/store');
  };

  return (
    <Container fluid>
      <Row>
        <Col md="3">
          <Button onClick={goBack}>Go Back to the Store</Button>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="mt-3">
          <div style={{ minHeight: '700px' }}>
            {loading === true && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
            {loading === false && 
              renderOrders(orders) 
            }
          </div>

          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <a className="page-link"  role="button" tabindex="-1" onClick={handleOnClickPrev}>Previous</a>
              </li>
              <li className="page-item">
                <span className="page-link" role="button" onClick={handleOnClickNext}>Next</span>
              </li>
            </ul>
          </nav>
        </Col>
      </Row>

    </Container>
  );
}

export default StoreOrderComponent;
