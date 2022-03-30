import React, { useState, useEffect } from "react";

import UserComponent from '../components/UserComponent/index.js'
import { Tabs, Tab } from 'react-bootstrap'

import {
  Container,
  Row,
} from "react-bootstrap";

function Users() {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    let item = localStorage.getItem('activeTabUsers');

    if (!item) setActiveTab(0); 
    else setActiveTab(item);
  }, []);
  
  const userTypes = [
    {
      name: 'store_owners',
      title: 'Store Owners'
    },
    {
      name: 'marketers',
      title: 'Marketers'
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Tabs 
          id="controlled-tab-example"
          activeKey={activeTab}
          onSelect={(k) => {
            localStorage.setItem('activeTabUsers', k);
            setActiveTab(k);
          }} 
          className="mb-3"
        >
          {userTypes.map((user, i) => {
            return (
              <Tab eventKey={i} activeKey={activeTab} title={user.title}>        
                <UserComponent activeTab={activeTab} />
              </Tab>
            );
          })}
        </Tabs>
      </Row>
    </Container>
  );
}

export default Users;
