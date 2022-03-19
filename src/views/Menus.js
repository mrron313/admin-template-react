import React, { useState } from "react";

import MenuComponent from '../components/MenuComponent/index.js'
import { Tabs, Tab } from 'react-bootstrap'

import {
  Container,
  Row,
} from "react-bootstrap";

function Menus() {
  const [key, setKey] = useState('menus');
  
  const menuTypes = [
    {
      name: 'menus',
      title: 'All Menus'
    },
    {
      name: 'assignableMenus',
      title: 'Assignable Menus'
    },
    {
      name: 'inReviewMenus',
      title: 'In Review Menus'
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Tabs 
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)} 
          className="mb-3"
        >
          {menuTypes.map(menu => {
            return (
              <Tab eventKey={menu.name} activeKey={0} title={menu.title}>        
                <MenuComponent type={menu.name} activeTab={key} menuTypes={menuTypes} />
              </Tab>
            );
          })}
        </Tabs>
      </Row>
    </Container>
  );
}

export default Menus;
