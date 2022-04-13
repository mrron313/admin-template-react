import React, { useContext, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { copyToClipboard } from 'Helpers/copy';
import toast from 'react-hot-toast';


import {
  Button,
  Card,
  Row,
  Col,
  Accordion,
  Badge,
  Spinner
} from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import AccordionContext from "react-bootstrap/AccordionContext";
import { BsFillArrowRightCircleFill, BsFillArrowDownCircleFill, BsChevronRight, BsChevronDown } from "react-icons/bs";
import CustomToast from '../../components/Notification/CustomToast';
import { putApiCall } from 'Helpers/api';

const options = {
  'complete': 'success',
  'assigned': 'warning',
  'in_review': 'info',
  'assignable': 'secondary',
  'new': 'primary',
};

const headers = { 
  'Content-Type': 'application/json'
};

function Menu() {
  const history = useHistory();
  const location = useLocation();

  const [pageLoading, setPageLoading] = useState(null);
  const [isLoading, setLoading] = useState(null);
  const token = localStorage.getItem('token');

  const [published_menu_details, setPublishedMenuDetails] = useState(null);
  const [draft_menu_details, setDraftMenuDetails] = useState(null);

  useEffect(() => {
    setPageLoading(true);
  
    const menu_published_id = localStorage.getItem('menu_published_id');
    const menu_draft_id = localStorage.getItem('menu_draft_id');

    let data = {
      "menu_published_id": menu_published_id,
      "menu_draft_id": menu_draft_id,
    }

    data = JSON.stringify(data);
    let url = 'fetch_menus_by_store';

    headers.Authorization = `Bearer ${token}`; 

    putApiCall(url, 'put', headers, data).then((result) => {
      if (result.data) {
        setPublishedMenuDetails(result.data.published_menu);
        setDraftMenuDetails(result.data.draft_menu);
        setPageLoading(false);
      } else {
        setPageLoading(false);
        setPublishedMenuDetails({});
        setDraftMenuDetails({});
      }
    });
  }, []);
  
  let renderCategories = (menu_details) => 
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

  const goBack = () => {
    history.push('/admin/store');
  }

  const goToURL = (url) => {
    window.open(`http://${url}`, "_blank")
  }

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

  return (
    <>
      <CustomToast />
      <Row>
        <Col md="12" className="mb-3">
          <Button onClick={goBack}>Go Back to the Store</Button>
        </Col>

        <Col md="12" className="mt-3">
          {pageLoading === true && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </Col>
      </Row>

      {pageLoading === false && (
        <Row>
          <Col md="12">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Published Menu</Accordion.Header>
                <Accordion.Body>
                    <Card className="card-user">
                      <Card.Header>
                        <h5 className="h6 flex-div">
                          <span style={{ width: '40%' }} className='flex-div-a'>
                            CATEGORIES 
                            <Badge style={{ marginLeft: '5px' }} className='badge rounded-pill' bg={options[published_menu_details.menu_process]}>{published_menu_details.menu_process}</Badge> 
                          </span>

                          <span style={{ width: '30%' }}>
                            <Badge onClick={() => goToURL(published_menu_details.entering_url)} style={{ cursor: 'pointer' }} size='sm'>url</Badge>
                          </span>

                          <div style={{ width: '10%', textAlign: 'right' }} className='flex-div-b'>
                            { published_menu_details.menu_process === 'assignable'? 
                              <Button disabled={isLoading !== null}  variant="light" onClick={() => assign(published_menu_details.menu_draft_id, published_menu_details.entering_id)}> 
                                {isLoading === null? 'Assign' : 'Loading'}
                              </Button> : '' }

                            { published_menu_details.menu_process  === 'in_review'? 
                              <Button disabled={isLoading !== null} variant="light" onClick={() => approve(published_menu_details.menu_draft_id, published_menu_details.entering_id)}> 
                                {isLoading === null? 'Approve' : 'Loading'}
                              </Button> : '' }
                          </div>
                        </h5>
                      </Card.Header>
                      <hr></hr>
                      <Card.Body>
                        {published_menu_details.categories.length === 0? 'No Categories Found' : renderCategories(published_menu_details)}  
                      </Card.Body>
                    </Card>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Draft Menu</Accordion.Header>
                <Accordion.Body>
                  <Card className="card-user">
                    <Card.Header>
                      <h5 className="h6 flex-div">
                        <span style={{ width: '40%' }} className='flex-div-a'>
                          CATEGORIES - Draft Menu
                          <Badge style={{ marginLeft: '5px' }} className='badge rounded-pill' bg={options[draft_menu_details.menu_process]}>{draft_menu_details.menu_process}</Badge> 
                        </span>

                        <span style={{ width: '30%' }}>
                          <Badge onClick={() => goToURL(draft_menu_details.entering_url)} style={{ cursor: 'pointer' }} size='sm'>url</Badge>
                        </span>

                        <div style={{ width: '10%', textAlign: 'right' }} className='flex-div-b'>
                          { draft_menu_details.menu_process === 'assignable'? 
                            <Button disabled={isLoading !== null}  variant="light" onClick={() => assign(draft_menu_details.menu_draft_id, draft_menu_details.entering_id)}> 
                              {isLoading === null? 'Assign' : 'Loading'}
                            </Button> : '' }

                          { draft_menu_details.menu_process  === 'in_review'? 
                            <Button disabled={isLoading !== null} variant="light" onClick={() => approve(draft_menu_details.menu_draft_id, draft_menu_details.entering_id)}> 
                              {isLoading === null? 'Approve' : 'Loading'}
                            </Button> : '' }
                        </div>
                      </h5>
                    </Card.Header>
                    <hr></hr>
                    <Card.Body>
                      {draft_menu_details.categories.length === 0? 'No Categories Found' : renderCategories(draft_menu_details)}  
                    </Card.Body>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      )}
    </>
  );
}

export default Menu;