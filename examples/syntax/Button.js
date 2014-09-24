/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactStyle  = require('react-style');

var baseStyle = ReactStyle`
  display: inline-block;
  zoom: 1;
  line-height: normal;
  white-space: nowrap;
  vertical-align: baseline;
  text-align: center;
  cursor: pointer;
  user-select: none;
`;

var activeStyle = ReactStyle`
  box-shadow: 0 0 0 1px rgba(0,0,0, 0.15) inset, 0 0 6px rgba(0,0,0, 0.20) inset;
`;

var linearGradient = 'linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10))';

var hoverStyle = ReactStyle`
  color: #000;
  background-image: ${linearGradient};
`;

var focusStyle = ReactStyle`
  background-image: ${linearGradient};
  outline: none;
`;

var style = ReactStyle`
  font-family: inherit;
  font-size: 100%;
  padding: 0.5em 1em;
  color: rgba(0, 0, 0, 0.70);
  border: none rgba(0, 0, 0, 0);
  background-color: #E6E6E6;
  text-decoration: none;
  border-radius: 3px;
`;

style.children[':active'] = activeStyle;
style.children[':hover'] = hoverStyle;
style.children[':focus'] = focusStyle;

var Button = React.createClass({

  render() {
    var styles = [
      baseStyle,
      style,
      this.props.active && activeStyle
    ].concat(this.props.styles);
    return this.transferPropsTo(
      <button styles={styles}>
        {this.props.children}
      </button>
    );
  },

  statics: {
    styles: {
      primary: ReactStyle`
        background-color: rgb(0, 120, 231);
        color: #fff;
      `,

      success: ReactStyle`
        color: white;
        background: rgb(28, 184, 65);
      `,

      error: ReactStyle`
        color: white;
        background: rgb(202, 60, 60);
      `
    }
  }

});

module.exports = Button;
