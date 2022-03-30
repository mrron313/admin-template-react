import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";

import { Container, Row, Badge, Button, Form, Spinner } from "react-bootstrap";
import Multiselect from 'multiselect-react-dropdown';
import { useHistory } from 'react-router-dom';

import { putApiCall } from "Helpers/api";

const options = {
  'complete': 'success',
  'assigned': 'warning',
  'in_review': 'info',
  'assignable': 'secondary',
  'new': 'primary',
};

const statuses = [
  'complete',
  'assigned',
  'in_review',
  'assignable',
  'new',
];

const headers = { 
  'Content-Type': 'application/json'
};

function UserComponent(props) {
  const history = useHistory();
  const { activeTab } = props;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [dateCreatedNextForStoreOwner, setDateCreatedNextForStoreOwner] = useState(null);
  const [dateCreatedPrevForStoreOwner, setDateCreatedPrevForStoreOwner] = useState([null]);
  const [page, setPage] = useState(0);

  const handleOnClickNext = () => {
    setPage(page+1);
    let prevs = dateCreatedPrevForStoreOwner;
    prevs.push(dateCreatedNextForStoreOwner);
    setDateCreatedPrevForStoreOwner(prevs);

    fetchStoreOwners('next');
  };

  const handleOnClickPrev = () => {
    if (page>0) {
      let prevs = dateCreatedPrevForStoreOwner;
      prevs.pop();
      let p = page - 1;

      setDateCreatedPrevForStoreOwner(prevs);
      setPage(p);
      fetchStoreOwners('prev', prevs, p);
    }
  };

  const fetchStoreOwners = (type, prevs, p) => {
    setLoading(true);
    
    let data, url;

    data = {
      "date_created": type === 'next'? dateCreatedNextForStoreOwner : type === 'prev'? prevs[p] : null,
    }
    
    url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_store_owners';
    data = JSON.stringify(data);

    putApiCall(url, 'put', headers, data).then((result) => {
      let ln = result.data.length;
      if (ln>0) {
        setDateCreatedNextForStoreOwner(result.data[ln-1].date_created);
        setUsers(result.data);
        setLoading(false);
      } else {
        setLoading(false);
        setUsers([]);
      }
    });
  }

  const fetchMarketers = () => {
    setLoading(true);

    let url, data;
    data = {
      "date_created": null
    };

    url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_marketers';
    data = JSON.stringify(data);

    putApiCall(url, 'put', headers, data).then((result) => {
      let ln = result.data.length;
      if (ln>0) {
        setUsers(result.data);
        setLoading(false);
      } else {
        setLoading(false);
        setUsers([]);
      }
    });
  }

  useEffect(() => {
    if (activeTab !== null) {
      if (activeTab == 0) {
        fetchStoreOwners();
      } else {
        fetchMarketers();
      }
    }
  }, [activeTab]);

  const renderUsers = (data) => {
    if (data.length === 0) return 'No menus found';

    return data.map(d => {
      console.log(d);
      return (
        <div onClick={() => openMenu(d)} style={{ cursor: 'pointer' }} className="store-item">
          <div>
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th width="40%" scope="col">Name</th>
                  <th width="30%" scope="col">Phone Number</th>
                  {(activeTab == 1) && (
                    <th width="30%" scope="col">Verification</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{`${d.firstname} ${d.lastname}`}</th>
                  <td>{d.phonenumber}</td>
                  {(activeTab == 1) && (
                    <td scope="col">{`${d.verified_affiliate_bank_account}`}</td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    });
  }

  const openMenu = (user_details) => {
    localStorage.setItem("user_details", JSON.stringify(user_details));
    history.push("/admin/user");
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
          renderUsers(users) 
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

export default UserComponent;
