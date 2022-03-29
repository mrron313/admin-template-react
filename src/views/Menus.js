import React, { useState, useEffect } from "react";

import MenuComponent from '../components/MenuComponent/index.js'
import { Tabs, Tab } from 'react-bootstrap'

import {
  Container,
  Row,
} from "react-bootstrap";

function Menus() {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    let item = localStorage.getItem('activeTabMenus');

    if (!item) setActiveTab(0); 
    else setActiveTab(item);
  }, []);
  
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
          activeKey={activeTab}
          onSelect={(k) => {
            localStorage.setItem('activeTabMenus', k);
            setActiveTab(k);
          }} 
          className="mb-3"
        >
          {menuTypes.map((menu, i) => {
            return (
              <Tab eventKey={i} activeKey={activeTab} title={menu.title}>        
                <MenuComponent activeTab={activeTab} />
              </Tab>
            );
          })}
        </Tabs>
      </Row>
    </Container>
  );
}

export default Menus;
