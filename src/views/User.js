import React from 'react';
import JSONPretty from 'react-json-pretty';

export default function User() {
  let user_details = localStorage.getItem('user_details');
  user_details = JSON.parse(user_details);

  return (
    <div className='store-item'>
      <JSONPretty 
        id="json-pretty" 
        data={user_details} 
        style={{fontSize: "1.1em"}} 
        mainStyle="padding:1.5em" 
        valueStyle="font-size:1.1em"
        space={4}
        >
      </JSONPretty>
    </div>
  );
}
