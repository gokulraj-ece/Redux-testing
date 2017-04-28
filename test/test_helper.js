import jsdom from 'jsdom';
import jquery from 'jquery';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import chai, { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../src/reducers';
import chaiJquery from 'chai-jquery';

// set up testing environment to run like a browser in the CLI
// browser => window, node => global
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
const $ = jquery(global.window); // jquery should be responsible for this fake window

// build renderComponent helper to render a given react Component
// component, props to be injected into component, state to be injected into redux store
function renderComponent(ComponentClass, props, state) {
  // creating an instance of the component and rendering it
  const componentInstance = TestUtils.renderIntoDocument(
    <Provider store={createStore(reducers, state)}>
      <ComponentClass {...props} />
    </Provider>

  );
  // getting access to actual dom element
  return $(ReactDOM.findDOMNode(componentInstance)); // reference to produced html
  // jquery wrapping just to facilitate access to useful jquery methods
}

// build helper for simulating events
// to call simulate => $('div').simulate => applied to all jquery usages
$.fn.simulate = function(eventName, value) {
  if (value) {
    this.val(value); // setting value of html element
  }
  TestUtils.Simulate[eventName](this[0]);
}

// set up chai-jquery
chaiJquery(chai, chai.util, $);

export { renderComponent, expect };
