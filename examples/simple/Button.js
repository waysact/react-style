/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactStyle  = require('react-style');

var purple = 'purple !important';

// example of CSS names style
var baseStyle = ReactStyle`
    background-color: ${purple};
    display: inline-block;
    zoom: 1;
    line-height: normal;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
    user-select: none;
  `;

var gray = '#E6E6E6';

// example of DOM names style
var style = ReactStyle({
  fontFamily: 'inherit',
  fontSize: '100%',
  padding: '0.5em 1em',
  color: 'rgba(0, 0, 0, 0.70)',
  border: 'none rgba(0, 0, 0, 0)',
  backgroundColor: gray,
  textDecoration: 'none',
  borderRadius: 3
});

var Button = React.createClass({

  render() {
    var styles = [
      baseStyle,
      style
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
