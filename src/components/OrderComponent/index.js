import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";

import { Container, Row, Badge, Button, Form, Spinner } from "react-bootstrap";
import Multiselect from 'multiselect-react-dropdown';
import { useHistory } from 'react-router-dom';

import { putApiCall } from "Helpers/api";

const headers = { 
  'Content-Type': 'application/json'
};

function MenuComponent(props) {
  const history = useHistory();

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
    url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_all_orders';

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

    return data.map(d => {
      console.log(d);
      return (
        <div onClick={() => openMenu(d)} style={{ cursor: 'pointer' }} className="store-item">
          <div>
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Store Name</th>
                  <th scope="col">Customer Phone Number</th>
                  <th scope="col">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{d.order_id}</th>
                  <td>{d.customer_name}</td>
                  <td>{d.store_name}</td>
                  <td>{d.phonenumber}</td>
                  <td>{d.total_amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    });
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

export default MenuComponent;
