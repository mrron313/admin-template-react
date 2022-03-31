import React from 'react';
import JSONPretty from 'react-json-pretty';

export default function Store() {
  let store_details = localStorage.getItem('store_details');
  store_details = JSON.parse(store_details);

  return (
    <div className='store-item'>
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
  );
}
