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

function MenuComponent(props) {
  const history = useHistory();
  const token = localStorage.getItem('token');

  const { activeTab } = props;
  const [selectedValues, setSelectedValues] = useState([...statuses]);
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [dateCreatedNext, setDateCreatedNext] = useState(null);
  const [dateCreatedPrev, setDateCreatedPrev] = useState([null]);
  const [page, setPage] = useState(0);

  const handleOnClickNext = () => {
    setPage(page+1);
    let prevs = dateCreatedPrev;
    prevs.push(dateCreatedNext);
    setDateCreatedPrev(prevs);

    fetchMenusAPI('next');
  };

  const handleOnClickPrev = () => {
    if (page>0) {
      let prevs = dateCreatedPrev;
      prevs.pop();
      let p = page - 1;

      setDateCreatedPrev(prevs);
      setPage(p);
      fetchMenusAPI('prev', prevs, p);
    }
  };

  const fetchMenusAPI = (type, prevs, p) => {
    setLoading(true);
    
    let data, url;

    data = {
      "date_created": type === 'next'? dateCreatedNext : type === 'prev'? prevs[p] : null,
    }

    if (selectedValues.length === 5) {
      data = JSON.stringify(data);
      url = 'get_all_menus';
    } else {
      url = 'filter_menu';
      data.statuses = selectedValues;
      data = JSON.stringify(data);
    }

    headers.Authorization = `Bearer ${token}`; 

    putApiCall(url, 'put', headers, data).then((result) => {
      let ln = result.data.length;
      if (ln>0) {
        setDateCreatedNext(result.data[ln-1].date_created);
        setMenus(result.data);
        setLoading(false);
      } else {
        setLoading(false);
        setMenus([]);
      }
    });
  }

  const fetchOtherMenusAPI = () => {
    setLoading(true);

    let url, data;
    data = {
      "date_created": null
    };

    if (activeTab == 1) {
      url = 'get_assignable_menus';
      data = JSON.stringify(data);
    } else if (activeTab == 2) {
      url = 'get_submitted_menus';
      data = JSON.stringify(data);
    }

    headers.Authorization = `Bearer ${token}`; 

    putApiCall(url, 'put', headers, data).then((result) => {
      let ln = result.data.length;
      if (ln>0) {
        setDateCreatedNext(result.data[ln-1].date_created);
        setMenus(result.data);
        setLoading(false);
      } else {
        setLoading(false);
        setMenus([]);
      }
    });
  }

  useEffect(() => {
    if (activeTab !== null) {
      if (activeTab == 0) {
        fetchMenusAPI();
      } else {
        fetchOtherMenusAPI();
      }
    }
  }, [activeTab, selectedValues.length]);

  const renderStores = (data) => {
    if (data.length === 0) return 'No menus found';

    return data.map(d => {
      return (
        <div onClick={() => openMenu(d)} style={{ cursor: 'pointer' }} className="store-item flex-div">
          <span className="flex-div-a">{ d.store_name } <Badge className='badge rounded-pill' bg={options[d.menu_process]}>{d.menu_process}</Badge></span> 
          <Button variant="primary" size="sm" className="flex-div-b" onClick={() => openMenu(d)}>
            View
          </Button>
        </div>
      );
    });
  }

  const openMenu = (menu_details) => {
    localStorage.setItem("menu_details", JSON.stringify(menu_details));
    history.push("/admin/menu");
  };

  const onSelect = (selectedList, selectedItem) => {
    setSelectedValues(selectedList);
  }

  const onRemove = (selectedList, removedItem) => {
    setSelectedValues(selectedList);
  }

  return (
    <Container fluid>
      <div style={{ minHeight: '700px' }}>
        {activeTab === 0 && (
          <Row className="mb-3">
            <Multiselect
              options={statuses} 
              selectedValues={selectedValues} 
              onSelect={onSelect} 
              onRemove={onRemove} 
              showCheckbox={true}
              isObject={false}
              hidePlaceholder={true}
              showArrow={true}
            />
          </Row>
        )}

        {loading === true && (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {loading === false && 
          renderStores(menus) 
        }
      </div>

      {activeTab == 0 && (
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
    </Container>
  );
}

export default MenuComponent;
