import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";

import { Container, Row, Badge, Button, Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { putApiCall } from "Helpers/api";

const options = {
  'complete': 'success',
  'assigned': 'warning',
  'in_review': 'info',
  'assignable': 'secondary',
  'new': 'primary',
};

function MenuComponent(props) {
  const [keyWord, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);

  const history = useHistory();

  const openMenu = (menu_details) => {
    localStorage.setItem("menu_details", JSON.stringify(menu_details));
    history.push("/admin/menu");
  };

  useEffect(() => {
    if (props.type !== props.activeTab) return;

    var data = JSON.stringify({
      "date_created": null
    });

    var headers = { 
      'Content-Type': 'application/json'
    };
    let url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_all_menus';

    if (props.type === 'inReviewMenus') {
      url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_submitted_menus';
    } else if (props.type === 'assignableMenus') {
      url = 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_assignable_menus';
    }

    putApiCall(url, 'put', headers, data).then((result) => {
      setMenus(result.data);
      setLoading(false);
    });
  }, [props.activeTab]);

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

  return (
    <Container fluid>
      {props.type === 'menus' && (
        <Row className="mb-3">
          <Form.Control
            as="select"
            value={keyWord}
            onChange={e => {
              setKeyword(e.target.value);
            }}
          >
            <option value="">Select Status</option>

            {Object.keys(options).map((key) => {
              return (
                <option>{key}</option>
              )
            })}
          </Form.Control>
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
