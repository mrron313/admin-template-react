import React from "react";

import "bootstrap/dist/css/bootstrap.css";

import { Container, Row, Accordion, Card, Button, Badge } from "react-bootstrap";

const colors = {
  'complete': 'green'
}

function EnhancedAccordion(props) {
  const { menus, inReviewMenus, assignableMenus } = props;

  const renderAccordions = (data) => {
    return data.map(d => {
      return (
        <Accordion.Item eventKey="0">
          <Accordion.Header>
          { d.store_name } <Badge style={{ backgrounColor: colors['complete'] }}>New</Badge>
          </Accordion.Header>
          <Accordion.Body>
            
          </Accordion.Body>
        </Accordion.Item>
      );
    });
  }

  return (
    <Container fluid>
      <Row>
        <Card>
          <Card.Header>All Menus</Card.Header>
          <Card.Body>
            <Accordion>
              {renderAccordions(menus)}
            </Accordion>
          </Card.Body>
        </Card>
      </Row>

      <Row>
        <Card>
          <Card.Header>Assignable Menus</Card.Header>
          <Card.Body>
            <Accordion>
              {renderAccordions(assignableMenus)}
            </Accordion>
          </Card.Body>
        </Card>
      </Row>

      <Row>
        <Card>
          <Card.Header>In Review Menus</Card.Header>
          <Card.Body>
            <Accordion>
              {renderAccordions(inReviewMenus)}
            </Accordion>
          </Card.Body>
        </Card>
      </Row>

    </Container>
  );
}

export default EnhancedAccordion;
