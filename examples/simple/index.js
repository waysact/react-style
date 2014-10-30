/**
 * @jsx React.DOM
 */
'use strict';

require('normalize.css/normalize.css');

var React       = require('react');
var ReactStyle  = require('react-style');
var Button      = require('./Button');
var ButtonGroup = require('./ButtonGroup');

var TextAlignSwitcher = React.createClass({

  render() {
    return (
      <ButtonGroup>
        <Button
          active={this.props.textAlign === 'left'}
          onClick={this.props.onTextAlign.bind(null, 'left')}>
          Left
        </Button>
        <Button
          active={this.props.textAlign === 'center'}
          onClick={this.props.onTextAlign.bind(null, 'center')}>
          Center
        </Button>
        <Button
          active={this.props.textAlign === 'right'}
          onClick={this.props.onTextAlign.bind(null, 'right')}>
          Right
        </Button>
      </ButtonGroup>
    );
  }
});

var Application = React.createClass({

  style: ReactStyle({
    backgroundColor: 'white',
    fontSize: '10pt',
    padding: '1em',
    children: {
      marginRight: '0.5em'
    },
    lastChild: {
      marginRight: 0
    }
  }),

  render() {
    return (
      <div styles={this.style}>
        <h1 styles={ReactStyle({textAlign: this.state.textAlign})}>Application</h1>
        <Button styles={Button.styles.success}>
          OK
        </Button>
        <Button styles={Button.styles.error}>
          Cancel
        </Button>
        <TextAlignSwitcher
          textAlign={this.state.textAlign}
          onTextAlign={this.onTextAlign}
          />
      </div>
    );
  },

  getInitialState() {
    return {textAlign: 'left'};
  },

  onTextAlign(textAlign) {
    this.setState({textAlign});
  }

});

if (typeof window !== 'undefined') {
  ReactStyle.inject();
  React.render(<Application />, document.getElementById('app'));
}

module.exports = Application;
