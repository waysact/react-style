/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Button = React.createClass({

  css: {
    normal: {
      backgroundColor: 'orange'
    },
    normal_hover: {
      backgroundColor: 'blue'
    }
  },

  getInitialState: function() {
    return {
      hover: false
    };
  },

  render: function() {
    var css = this.css;
    var className = css.normal;
    if (this.state.hover) {
      className += css.normal_hover;
    }
    return React.DOM.div({css: className});
  }

});

module.exports = Button;
