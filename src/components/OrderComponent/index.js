import React, { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.css";

import { Container, Row, Badge, Button, Form, Spinner, Accordion } from "react-bootstrap";

import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import AccordionContext from "react-bootstrap/AccordionContext";

import { putApiCall } from "Helpers/api";

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

  return (
    <Button
      variant="primary"
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}

function OrderComponent(props) {
  const history = useHistory();
  const token = localStorage.getItem('token');

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
      "date_created": type === 'next'? dateCreatedNext : type === 'prev'? prevs[p] : null,
    }

    data = JSON.stringify(data);
    url = 'get_all_orders';

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
            <div style={{ cursor: 'pointer' }} className="order-item">
              <div>
                <table class="table table-borderless" style={{ marginBottom: '0px' }}>
                  <thead>
                    <tr onClick={() => openOrder(d)} >
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
                      <th onClick={() => openOrder(d)}  scope="row">{d.order_id}</th>
                      <td onClick={() => openOrder(d)} >{d.customer_name}</td>
                      <td onClick={() => openOrder(d)} >{d.store_name}</td>
                      <td onClick={() => openOrder(d)} >{d.phonenumber}</td>
                      <td onClick={() => openOrder(d)} >{d.total_amount}</td>
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

  return (
    <Container fluid>
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
    </Container>
  );
}

export default OrderComponent;
