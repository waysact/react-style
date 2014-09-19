/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react');
var ReactStyle      = require('react-style');

var ButtonGroup = React.createClass({

  style: ReactStyle`
    display: inline-block;
  `,

  render() {
    var styles = [this.style, this.props.styles];
    return ReactStyle.style(styles,
      <div>{this.props.children}</div>
    );
  }
});

module.exports = ButtonGroup;
