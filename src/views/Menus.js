import React, { useState, useEffect } from "react";

import EnhancedAccordion from '../components/Accordion/index.js'
import Form from 'react-bootstrap/Form'

import {
  Container,
  Row,
} from "react-bootstrap";
import { putApiCall } from "Helpers/api.js";

function Menus() {
  const [keyWord, setKeyword] = useState('');
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    var data = JSON.stringify({
      "date_created": null
    });

    var headers = { 
      'Content-Type': 'application/json'
    };

    putApiCall('https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/get_all_menus', 'put', headers, data).then((result) => setMenus(result))
  }, []);

  return (
    <Container fluid>
      <Row className="mb-3">
        <Form.Control
          as="select"
          value={keyWord}
          onChange={e => {
            console.log("e.target.value", e.target.value);
            setKeyword(e.target.value);
          }}
        >
          <option value="">Select Status</option>
        </Form.Control>
      </Row>

      <Row>
        <EnhancedAccordion menus={menus} assignableMenus={menus} inReviewMenus={menus} />
      </Row>
    </Container>
  );
}

export default Menus;
