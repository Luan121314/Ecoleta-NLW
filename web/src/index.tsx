import React from 'react';
import ReactDOM from 'react-dom';
import Favicon from 'react-favicon'
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Favicon url="https://img.icons8.com/color/48/000000/recycling.png" />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
