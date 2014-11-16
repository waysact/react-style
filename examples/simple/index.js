/**
 * @jsx React.DOM
 */
'use strict';

require('normalize.css/normalize.css');

var ReactStyle   = require('react-style');
var React        = require('react');
var Icon         = require('react-fa');
var Button       = require('./Button');
var ButtonStyles = require('./ButtonStyles');
var ButtonGroup  = require('./ButtonGroup');

var TextAlignSwitcher = React.createClass({

  render() {
    var props = this.props;
    var textAlign = props.textAlign;
    var onTextAlign = props.onTextAlign;
    return (
      <ButtonGroup styles={props.styles}>
        <Button
          active={textAlign === 'left'}
          onClick={onTextAlign.bind(null, 'left')}>
          <Icon name="align-left" /> Left
        </Button>
        <Button
          active={textAlign === 'center'}
          onClick={onTextAlign.bind(null, 'center')}>
          <Icon name="align-center" /> Center
        </Button>
        <Button
          active={textAlign === 'right'}
          onClick={onTextAlign.bind(null, 'right')}>
          <Icon name="align-right" /> Right
        </Button>
      </ButtonGroup>
    );
  }
});

var ApplicationStyles = {

  normalStyle: ReactStyle({
    backgroundColor: 'white',
    fontSize: '10pt',
    padding: '1em',
    margin: 10
  }, 'Application_normalStyle'),

  childStyle: ReactStyle({
    marginRight: '0.5em'
  }, 'Application_childStyle'),

  lastChildStyle: ReactStyle({
    marginRight: 0
  }, 'Application_lastChildStyle')

};

class Application {

  render() {
    return (
      <div styles={ApplicationStyles.normalStyle}>
        <h1 styles={ReactStyle({textAlign: this.state.textAlign})}>Application</h1>
        <Button styles={[ButtonStyles.success]}>
          <Icon name="cog" /> OK
        </Button>
        <Button styles={[ApplicationStyles.childStyle, ButtonStyles.error]}>
          <Icon name="remove" /> Cancel
        </Button>
        <TextAlignSwitcher
          styles={ApplicationStyles.lastChild}
          textAlign={this.state.textAlign}
          onTextAlign={this.onTextAlign}
          />
      </div>
    );
  }

  getInitialState() {
    return {
      textAlign: 'left'
    };
  }

  onTextAlign(textAlign) {
    this.setState({textAlign});
  }

}

if (typeof window !== 'undefined') {
  ReactStyle.inject();
  var ApplicationTag = React.createClass(Application.prototype);
  React.render(<ApplicationTag />, document.getElementById('app'));
}