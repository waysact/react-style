/**
 * @jsx React.DOM
 */
require("./style.css");

var React = require('react');
var Button = require('./Button');
var Tab = require('./Tab');

React.renderComponent(<Button />, document.getElementById('main'));
