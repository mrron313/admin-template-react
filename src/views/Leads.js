import React, { useEffect, useState } from 'react'

import { putApiCall } from "Helpers/api";

import { Spinner } from "react-bootstrap";

const headers = { 
  'Content-Type': 'application/json'
};

export default function Leads() {
  const token = localStorage.getItem('token');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = (type, prevs, p) => {
    setLoading(true);
    
    let data, url;

    data = JSON.stringify(data);
    url = 'get_leads';

    headers.Authorization = `Bearer ${token}`; 

    putApiCall(url, 'put', headers, data).then((result) => {
      setData(result.data);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      {loading === true && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {loading === false && 
        <div>
          {data.map(d => (
            <div className="order-item">
              <table class="table table-borderless" style={{ marginBottom: '0px' }}>
                <thead>
                  <tr>
                    <th scope="col">Business Address</th>
                    <th scope="col">Email</th>
                    <th scope="col">Business Name</th>
                    <th scope="col">Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{d.business_address}</th>
                    <td>{d.email}</td>
                    <td>{d.business_name}</td>
                    <td>{d.phonenumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
