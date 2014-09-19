/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var ReactStyle  = require('react-style');

// example of CSS names style
var baseStyle = ReactStyle`
    background-color: purple;
    display: inline-block;
    zoom: 1;
    line-height: normal;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
    user-select: none;
  `;

var activeStyle = ReactStyle({
  boxShadow: '0 0 0 1px rgba(0,0,0, 0.15) inset, 0 0 6px rgba(0,0,0, 0.20) inset'
});

var hoverStyle = ReactStyle({
  color: '#000',
  backgroundImage: 'linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10))'
});

var focusStyle = ReactStyle({
  backgroundImage: 'linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10))',
  outline: 'none'
});

var style = ReactStyle({
  fontFamily: 'inherit',
  fontSize: '100%',
  padding: '0.5em 1em',
  color: 'rgba(0, 0, 0, 0.70)',
  border: 'none rgba(0, 0, 0, 0)',
  backgroundColor: '#E6E6E6',
  textDecoration: 'none',
  borderRadius: '3px',
  onActive: activeStyle,
  onHover: hoverStyle,
  onFocus: focusStyle
});

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
      primary: ReactStyle({
        backgroundColor: 'rgb(0, 120, 231)',
        color: '#fff'
      }),

      success: ReactStyle({
        color: 'white',
        background: 'rgb(28, 184, 65)'
      }),

      error: ReactStyle({
        color: 'white',
        background: 'rgb(202, 60, 60)'
      })
    }
  }

});

module.exports = Button;
