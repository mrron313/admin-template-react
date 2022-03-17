import React, { useContext } from 'react';

import {
  Button,
  Card,
  Row,
  Col,
  Accordion,
} from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import AccordionContext from "react-bootstrap/AccordionContext";
import { BsFillArrowRightCircleFill, BsFillArrowDownCircleFill, BsChevronRight, BsChevronDown } from "react-icons/bs";

function Menu() {
  let menu_details = localStorage.getItem('menu_details');
  menu_details = JSON.parse(menu_details);

  let renderCategories = () => 
    menu_details.categories.map((category, i) => {
      function CustomToggle({ children, eventKey, callback }) {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
          eventKey,
          () => callback && callback(eventKey),
        );

        const isCurrentEventKey = activeEventKey === eventKey;
      
        return (
          isCurrentEventKey ? 
          <BsFillArrowDownCircleFill className='category-arrow-icon' onClick={decoratedOnClick} /> :
          <BsFillArrowRightCircleFill className='category-arrow-icon' onClick={decoratedOnClick} />
        );
      }

      return (
        <Accordion key={i}>
          <Card className='category-card'>
            <div className='category-card-div flex-div'>
              <div className='flex-div-a'>
                <h4> { category.category } </h4>
              </div>
              <div className='flex-div-b'>
                <CustomToggle eventKey={i}></CustomToggle>
              </div>
            </div>
            <Accordion.Collapse eventKey={i}>
              <div> {renderItems(category.items)} </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    });

  let renderItems = (items) => 
    items.map((item, i) => {
      console.log(item);

      function CustomToggle({ children, eventKey, callback }) {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
          eventKey,
          () => callback && callback(eventKey),
        );

        const isCurrentEventKey = activeEventKey === eventKey;
      
        return (
          isCurrentEventKey ? 
          <BsChevronDown className='item-arrow-icon' onClick={decoratedOnClick} /> :
          <BsChevronRight className='item-arrow-icon' onClick={decoratedOnClick} />
        );
      }

      return (
        <Accordion key={i}>
          <Card className='item-card'>
            <div className='item-card-div flex-div'>
              <div className='flex-div-a'>
                <h6 className='item-name'> { item.item_name } </h6>
              </div>
              <div className='flex-div-b'>
                <CustomToggle eventKey={i}></CustomToggle>
              </div>
            </div>
            <Accordion.Collapse eventKey={i}>
              <div className='details-section'>
                <div>
                  <span className="total-price">Price ${ item.item_price }</span>
                </div>
                <div className='description'>
                  {/* {item.item_description} */}
                  Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
                </div>
                {renderOptionGroups(item.option_groups)}
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    });

  let renderOptionGroups = (option_groups) => 
    option_groups.map((option_group, i) => {
      function CustomToggle({ children, eventKey, callback }) {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
          eventKey,
          () => callback && callback(eventKey),
        );

        const isCurrentEventKey = activeEventKey === eventKey;
      
        return (
          isCurrentEventKey ? 
          <BsChevronDown className='item-arrow-icon' onClick={decoratedOnClick} /> :
          <BsChevronRight className='item-arrow-icon' onClick={decoratedOnClick} />
        );
      }

      return (
        <Accordion key={i}>
          <Card className='item-card'>
            <div className='item-card-div flex-div'>
              <div className='flex-div-a'>
                <h6> { option_group.group_name } </h6>
              </div>
              <div className='flex-div-b'>
                <CustomToggle eventKey={i}></CustomToggle>
              </div>
            </div>
            <Accordion.Collapse eventKey={i}>
              <div> {renderOptions(option_group.options)} </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    });

  let renderOptions = (options) => 
    options.map((option, i) => {
      function CustomToggle({ children, eventKey, callback }) {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
          eventKey,
          () => callback && callback(eventKey),
        );

        const isCurrentEventKey = activeEventKey === eventKey;
      
        return (
          isCurrentEventKey ? 
          <BsChevronDown className='item-arrow-icon' onClick={decoratedOnClick} /> :
          <BsChevronRight className='item-arrow-icon' onClick={decoratedOnClick} />
        );
      }

      return (
        <Accordion key={i}>
          <Card className='item-card'>
            <div className='item-card-div flex-div'>
              <div className='flex-div-a'>
                <h6> { option.option_name } </h6>
              </div>
              <div className='flex-div-b'>
                <CustomToggle eventKey={i}></CustomToggle>
              </div>
            </div>
            <Accordion.Collapse eventKey={i}>
              <span className="total-price">Price ${ option.option_price }</span>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    });

  const approve = (menu_draft_id) => {
    var data = JSON.stringify({
      'menu_draft_id': menu_draft_id
    });

    var headers = { 
      'Content-Type': 'application/json'
    };

    putApiCall('https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/approve_menu', 'put', headers, data).then((result) => console.log('assigned'))
  }

  const assign = (menu_draft_id) => {
    var data = JSON.stringify({
      'menu_draft_id': menu_draft_id
    });

    var headers = { 
      'Content-Type': 'application/json'
    };

    putApiCall('https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/assign_menu', 'put', headers, data).then((result) => console.log('assigned'))
  }

  return (
    <>
      <Row>
        <Col md="8" className="mx-auto">
          <Card className="card-user">
            <Card.Header>
              <h5 className="h5">CATEGORIES
                
                { menu_details.menu_process === 'assignable'? 
                  <Button onClick={() => assign(menu_details.menu_draft_id)}> 
                    Assign
                  </Button> : '' }

                { menu_details.menu_process === 'in_review'? 
                  <Button onClick={() => approve(menu_details.menu_draft_id)}> 
                    Approve
                  </Button> : '' }

              </h5>
            </Card.Header>
            <hr></hr>
            <Card.Body>
              {renderCategories()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Menu;