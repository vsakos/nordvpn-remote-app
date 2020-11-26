import 'core-js';
import 'regenerator-runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import './icon.png';
import './manifest.webmanifest';

function render (root, Component) {
  ReactDOM.render(<Component/>, root);
}

const root = document.getElementById('root');

render(root, App);

if (module.hot) {
  module.hot.accept('./components/App.js', () => {
    render(root, require('./components/App').default);
  });
}
