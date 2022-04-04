import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";

import { Container, Row, Badge, Button, Form, Spinner } from "react-bootstrap";
import { AiOutlineCheck } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";

import { useHistory } from 'react-router-dom';

import { putApiCall } from "Helpers/api";

const headers = { 
  'Content-Type': 'application/json'
};

function StoreComponent(props) {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const { activeTab } = props;
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [dateCreatedNextForStores, setDateCreatedNextForStores] = useState(null);
  const [dateCreatedPrevForStores, setDateCreatedPrevForStores] = useState([null]);

  const [dateCreatedNextForPendingStores, setDateCreatedNextForPendingStores] = useState([null]);
  const [dateCreatedPrevForPendingStores, setDateCreatedPrevForPendingStores] = useState([null]);
  const [page, setPage] = useState(0);

  const handleOnClickNext = () => {
    setPage(page+1);
    let prevs = dateCreatedPrevForStores;
    prevs.push(dateCreatedNextForStores);
    setDateCreatedPrevForStores(prevs);

    fetchStores('next');
  };

  const handleOnClickPrev = () => {
    if (page>0) {
      let prevs = dateCreatedPrevForStores;
      prevs.pop();
      let p = page - 1;

      setDateCreatedPrevForStores(prevs);
      setPage(p);
      fetchStores('prev', prevs, p);
    }
  };

  const fetchStores = (type, prevs, p) => {
    setLoading(true);
    
    let data, url;

    data = {
      "date_created": type === 'next'? dateCreatedNextForStores : type === 'prev'? prevs[p] : null,
    }
    
    url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_all_stores';
    data = JSON.stringify(data);

    headers.Authorization = `Bearer ${token}`; 

    putApiCall(url, 'put', headers, data).then((result) => {
      let ln = result.data.length;
      if (ln>0) {
        setDateCreatedNextForStores(result.data[ln-1].date_created);
        setStores(result.data);
        setLoading(false);
      } else {
        setLoading(false);
        setStores([]);
      }
    });
  }

  const handleOnClickNextPendingStores = () => {
    setPage(page+1);
    let prevs = dateCreatedPrevForPendingStores;
    prevs.push(dateCreatedNextForPendingStores);
    setDateCreatedPrevForPendingStores(prevs);

    fetchPendingStores('next');
  };

  const handleOnClickPrevPendingStores = () => {
    if (page>0) {
      let prevs = dateCreatedPrevForPendingStores;
      prevs.pop();
      let p = page - 1;

      setDateCreatedPrevForPendingStores(prevs);
      setPage(p);
      fetchPendingStores('prev', prevs, p);
    }
  };

  const fetchPendingStores = (type, prevs, p) => {
    setLoading(true);

    let url, data;
    data = {
      "date_created": type === 'next'? dateCreatedNextForPendingStores : type === 'prev'? prevs[p] : null,
    };

    url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_pending_stores';
    data = JSON.stringify(data);

    headers.Authorization = `Bearer ${token}`; 

    putApiCall(url, 'put', headers, data).then((result) => {
      let ln = result.data.length;
      if (ln>0) {
        setStores(result.data);
        setLoading(false);
      } else {
        setLoading(false);
        setStores([]);
      }
    });
  }

  useEffect(() => {
    if (activeTab !== null) {
      if (activeTab == 0) {
        setPage(0);
        fetchStores();
      } else {
        setPage(0);
        fetchPendingStores();
      }
    }
  }, [activeTab]);

  const renderStores = (data) => {
    if (data.length === 0) return 'No stores found';

    return data.map(d => {
      return (
        <div onClick={() => openStore(d)} style={{ cursor: 'pointer' }} className="store-item">
          <table class="table table-borderless">
              <thead>
                <tr>
                  <th width="15%" scope="col">Name</th>
                  <th width="30%" scope="col">Address</th>
                  <th width="15%" scope="col">Owner</th>
                  <th width="15%" scope="col">Phone Number</th>
                  <th width="15%" scope="col">Completion Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{d.store_name}</th>
                  <td>{d.store_address}</td>
                  <td scope="col">{`${d.store_owner_firstname} ${d.store_owner_lastname}`}</td>
                  <td>{d.store_phonenumber}</td>
                  <td>
                    <h6 className="d-inline">
                      <Badge pill bg={d.completion_information.menu ? 'success' : 'danger'} className="m-1">
                        {d.completion_information.menu ? 
                          <AiOutlineCheck style={{ paddingRight: '5px', fontSize: '20px' }} />
                          : 
                          <GiCancel style={{ paddingRight: '5px', fontSize: '20px' }} />
                        }
                        menu
                      </Badge>
                    </h6>
                    <h6 className="d-inline">
                      <Badge pill bg={d.completion_information.bank_account ? 'success' : 'danger'} className="m-1">
                        {d.completion_information.bank_account ? 
                          <AiOutlineCheck style={{ paddingRight: '5px', fontSize: '20px' }} />
                          : 
                          <GiCancel style={{ paddingRight: '5px', fontSize: '20px' }} />
                        }
                        bank account
                      </Badge>
                    </h6>
                    <h6 className="d-inline">
                      <Badge pill bg={d.completion_information.discount_and_commission ? 'success' : 'danger'} className="m-1">
                        {d.completion_information.discount_and_commission ? 
                          <AiOutlineCheck style={{ paddingRight: '5px', fontSize: '20px' }} />
                          : 
                          <GiCancel style={{ paddingRight: '5px', fontSize: '20px' }} />
                        }
                        discount and commission
                      </Badge>
                    </h6>
                    <h6 className="d-inline">
                      <Badge pill bg={d.completion_information.opening_hours ? 'success' : 'danger'} className="m-1">
                        {d.completion_information.opening_hours ? 
                          <AiOutlineCheck style={{ paddingRight: '5px', fontSize: '20px' }} />
                          : 
                          <GiCancel style={{ paddingRight: '5px', fontSize: '20px' }} />
                        }
                        opening hours
                      </Badge>
                    </h6>
                    <h6 className="d-inline">
                      <Badge pill bg={d.completion_information.tax_rate ? 'success' : 'danger'} className="m-1">
                        {d.completion_information.tax_rate ? 
                          <AiOutlineCheck style={{ paddingRight: '5px', fontSize: '20px' }} />
                          : 
                          <GiCancel style={{ paddingRight: '5px', fontSize: '20px' }} />
                        }
                        tax rate
                      </Badge>
                    </h6>
                    <h6 className="d-inline">
                      <Badge pill bg={d.completion_information.timezone ? 'success' : 'danger'}  className="m-1">
                        {d.completion_information.timezone ? 
                          <AiOutlineCheck style={{ paddingRight: '5px', fontSize: '20px' }} />
                          : 
                          <GiCancel style={{ paddingRight: '5px', fontSize: '20px' }} />
                        }
                        timezone
                      </Badge>
                    </h6>
                    <h6>
                      <Badge pill bg={d.completion_information.initial_login ? 'success' : 'danger'} className="m-1">
                        {d.completion_information.initial_login ? 
                          <AiOutlineCheck style={{ paddingRight: '5px', fontSize: '20px' }} />
                          : 
                          <GiCancel style={{ paddingRight: '5px', fontSize: '20px' }} />
                        }
                        initial login
                      </Badge>
                    </h6>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      );
    });
  }

  const openStore = (store_details) => {
    if (activeTab == 1) store_details.store_status ='pending'; 
    localStorage.setItem("store_details", JSON.stringify(store_details));
    history.push("/admin/store");
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
          renderStores(stores) 
        }
      </div>

      { activeTab == 0 && (
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
      )}

      { activeTab == 1 && (
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link"  role="button" tabindex="-1" onClick={handleOnClickPrevPendingStores}>Previous</a>
            </li>
            <li className="page-item">
              <span className="page-link" role="button" onClick={handleOnClickNextPendingStores}>Next</span>
            </li>
          </ul>
        </nav>
      )}

    </Container>
  );
}

export default StoreComponent;
