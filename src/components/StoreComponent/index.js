import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";

import { Container, Row, Badge, Button, Form, Spinner } from "react-bootstrap";
import Multiselect from 'multiselect-react-dropdown';
import { useHistory } from 'react-router-dom';

import { putApiCall } from "Helpers/api";

const headers = { 
  'Content-Type': 'application/json'
};

function StoreComponent(props) {
  const history = useHistory();
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

  const fetchPendingStores = () => {
    setLoading(true);

    let url, data;
    data = {
      "date_created": null
    };

    url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_pending_stores';
    data = JSON.stringify(data);

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
        fetchStores();
      } else {
        fetchPendingStores();
      }
    }
  }, [activeTab]);

  const renderStores = (data) => {
    if (data.length === 0) return 'No menus found';

    return data.map(d => {
      console.log(d);
      return (
        <div onClick={() => openStore(d)} style={{ cursor: 'pointer' }} className="store-item flex-div">
          <span className="flex-div-a">{ d.store_name } <Badge className='badge rounded-pill'>{d.store_address}</Badge></span> 
          <Button variant="primary" size="sm" className="flex-div-b" onClick={() => openStore(d)}>
            View
          </Button>
        </div>
      );
    });
  }

  const openStore = (store_details) => {
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

export default StoreComponent;
