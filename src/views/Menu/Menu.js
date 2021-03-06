import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { copyToClipboard } from 'Helpers/copy';
import toast from 'react-hot-toast';

import {
  Button,
  Card,
  Row,
  Col,
  Accordion,
  Badge
} from 'react-bootstrap';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { BsFillArrowRightCircleFill, BsFillArrowDownCircleFill, BsChevronRight, BsChevronDown } from 'react-icons/bs';
import CustomToast from '../../components/Notification/CustomToast';
import { putApiCall } from 'Helpers/api';

const options = {
  'complete': 'success',
  'assigned': 'warning',
  'in_review': 'info',
  'assignable': 'secondary',
  'new': 'primary',
};

function Menu() {
  const history = useHistory();
  const [isLoading, setLoading] = useState(null);
  const token = localStorage.getItem('token');

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
              <div className='item-card'> 
                {category.items.length === 0? 'No Items Found' : renderItems(category.items)}  
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    });

  let renderItems = (items) => 
    items.map((item, i) => {
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
          <Card>
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
                  {item.item_description}
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

  const approve = (menu_draft_id, entering_id) => {
    setLoading(true);
    var data = JSON.stringify({
      'menu_draft_id': menu_draft_id
    });

    var headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    copyToClipboard(entering_id);

    putApiCall('approve_menu', 'put', headers, data).then((result) => {
      setLoading(false);
      toast.success('The menu is approved');
      setTimeout(() => {
        goBack();
      }, 2000);
    });
  }

  const assign = (menu_draft_id, entering_id) => {
    setLoading(true);
    var data = JSON.stringify({
      'menu_draft_id': menu_draft_id
    });

    var headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    copyToClipboard(entering_id);

    putApiCall('assign_menu', 'put', headers, data).then((result) => {
      setLoading(false);
      toast.success('The menu is assigned');
      setTimeout(() => {
        goBack();
      }, 2000);
    });
  }

  const goBack = () => {
    history.push('/admin/menus');
  }

  const goToURL = (url) => {
    window.open(`http://${url}`, "_blank")
  }

  return (
    <>
      <CustomToast />
      <Row>
        <Col md="3" className="offset-md-1 mb-3">
          <Button onClick={goBack}>Go Back to Menus</Button>
        </Col>
      </Row>
      <Row>
        <Col md="10" className="offset-md-1">
          <Card className="card-user">
            <Card.Header>
              <h5 className="h6 flex-div">
                <span style={{ width: '40%' }} className='flex-div-a'>
                  CATEGORIES 
                  <Badge style={{ marginLeft: '5px' }} className='badge rounded-pill' bg={options[menu_details.menu_process]}>{menu_details.menu_process}</Badge> 
                </span>

                <span style={{ width: '30%' }}>
                  <Badge onClick={() => goToURL(menu_details.entering_url)} style={{ cursor: 'pointer' }} size='sm'>url</Badge>
                </span>
                
                <div style={{ width: '10%', textAlign: 'right' }} className='flex-div-b'>
                  { menu_details.menu_process === 'assignable'? 
                    <Button disabled={isLoading !== null}  variant="light" onClick={() => assign(menu_details.menu_draft_id, menu_details.entering_id)}> 
                      {isLoading === null? 'Assign' : 'Loading'}
                    </Button> : '' }

                  { menu_details.menu_process  === 'in_review'? 
                    <Button disabled={isLoading !== null} variant="light" onClick={() => approve(menu_details.menu_draft_id, menu_details.entering_id)}> 
                      {isLoading === null? 'Approve' : 'Loading'}
                    </Button> : '' }
                </div>
              </h5>
            </Card.Header>
            <hr></hr>
            <Card.Body>
              {menu_details.categories.length === 0? 'No Categories Found' : renderCategories()}  
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Menu;