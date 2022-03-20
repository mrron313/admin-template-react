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
  const [selectedValues, setSelectedValues] = useState([...statuses]);
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);

  const history = useHistory();

  useEffect(() => {
    if (props.type !== props.activeTab) return;

    setLoading(true);

    let data = {
      "date_created": null
    };

    let url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_all_menus';

    if (props.type === 'menus') {
      if (selectedValues.length === 5) {
        data = JSON.stringify(data);
      } else {
        url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/filter_menu';
        data = {
          "date_created": null,
          statuses: selectedValues
        };
        data = JSON.stringify(data);
      }
    } else {
      if (props.type === 'inReviewMenus') {
        url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_submitted_menus';
        data = JSON.stringify(data);
      } else if (props.type === 'assignableMenus') {
        url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_assignable_menus';
        data = JSON.stringify(data);
      }
    }

    putApiCall(url, 'put', headers, data).then((result) => {
      setMenus(result.data);
      setLoading(false);
    });
  }, [props.activeTab, selectedValues.length]);

  const renderStores = (data) => {
    if (data.length === 0) return 'No menus found';

    return data.map(d => {
      return (
        <div className="store-item flex-div">
          <span className="flex-div-a">{ d.store_name } <Badge className='badge rounded-pill' bg={options[d.menu_process]}>{d.menu_process}</Badge></span> 
          <Button variant="light" size="sm" className="flex-div-b" onClick={() => openMenu(d)}>
            Open
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
      {props.type === 'menus' && (
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
    </Container>
  );
}

export default MenuComponent;
