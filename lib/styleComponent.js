'use strict';

var cloneWithProps         = require('react/lib/cloneWithProps');

function styleComponent(styles, component) {
  var componentStyles = [].concat(component.props.styles || [], styles);
  component = cloneWithProps(component, {
    styles:   componentStyles
  });

  return component;
}

module.exports = styleComponent;
