import React from 'react';
import JSONPretty from 'react-json-pretty';

export default function Order() {
  let order_details = localStorage.getItem('order_details');
  order_details = JSON.parse(order_details);

  return (
    <div className='store-item'>
      <JSONPretty 
        id="json-pretty" 
        data={order_details} 
        style={{fontSize: "1.1em"}} 
        mainStyle="padding:1.5em" 
        valueStyle="font-size:1.1em"
        space={4}
        >
      </JSONPretty>
    </div>
  );
}
