import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import JSONPretty from 'react-json-pretty';
import CustomToast from '../components/Notification/CustomToast';
import toast from 'react-hot-toast';
import {   
  Button,
  Row,
  Col, 
} from 'react-bootstrap';
import { putApiCall } from 'Helpers/api';

export default function Store() {
  const history = useHistory();
  let store_details = localStorage.getItem('store_details');
  store_details = JSON.parse(store_details);
  const [isLoading, setLoading] = useState(null);

  const goBack = () => {
    history.push('/admin/stores');
  }

  const approve = (store_id) => {
    setLoading(true);
    var data = JSON.stringify({
      'store_id': store_id
    });

    var headers = { 
      'Content-Type': 'application/json'
    };

    putApiCall('https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/approve_store', 'put', headers, data).then((result) => {
      setLoading(false);
      toast.success('The store is approved');
      setTimeout(() => {
        goBack();
      }, 2000);
    });
  }

  return (
    <>
      <Row>
        <Col md="3">
          <Button onClick={goBack}>Go Back to Stores</Button>
        </Col>
      </Row>
      <div className='store-item'>
        <CustomToast />
        { store_details.store_status === 'pending' && (<Button disabled={isLoading !== null}  variant="light" onClick={() => approve(store_details.store_id)}> 
          {isLoading === null? 'Approve' : 'Loading'}
        </Button> )}
        <JSONPretty 
          id="json-pretty" 
          data={store_details} 
          style={{fontSize: "1.1em"}} 
          mainStyle="padding:1.5em" 
          valueStyle="font-size:1.1em"
          space={4}
          >
        </JSONPretty>
      </div>
    </>
  );
}
