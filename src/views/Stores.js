import React, { useState, useEffect } from "react";

import StoreComponent from '../components/StoreComponent/index.js'
import { Tabs, Tab } from 'react-bootstrap'

import {
  Container,
  Row,
} from "react-bootstrap";

function Stores() {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    let item = localStorage.getItem('activeTabStores');

    if (!item) setActiveTab(0); 
    else setActiveTab(item);
  }, []);
  
  const userTypes = [
    {
      name: 'all_stores',
      title: 'All Stores'
    },
    {
      name: 'pending_stores',
      title: 'Pending Stores'
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Tabs 
          id="controlled-tab-example"
          activeKey={activeTab}
          onSelect={(k) => {
            localStorage.setItem('activeTabStores', k);
            setActiveTab(k);
          }} 
          className="mb-3"
        >
          {userTypes.map((user, i) => {
            return (
              <Tab eventKey={i} activeKey={activeTab} title={user.title}>        
                <StoreComponent activeTab={activeTab} />
              </Tab>
            );
          })}
        </Tabs>
      </Row>
    </Container>
  );
}

export default Stores;
