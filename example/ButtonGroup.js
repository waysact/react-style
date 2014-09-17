/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react');
var ReactStyle      = require('react-style');

var ButtonGroup = React.createClass({

  style: ReactStyle`
    display: inline-block;
    children {
      margin: 0;
      border-radius: 0;
    }
    :first-child {
      margin: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    },
    :last-child {
      margin: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  `,

  render() {
    var styles = [this.style, this.props.styles];
    return ReactStyle.style(styles,
      <div>{this.props.children}</div>
    );
  }
});

module.exports = ButtonGroup;
