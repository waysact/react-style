'use strict';

var cloneWithProps         = require('react/lib/cloneWithProps');
var styleComponentChildren = require('./styleComponentChildren');

function styleComponent(styles, component) {
  var componentStyles = [].concat(component.props.styles || [], styles);
  var children = component.props.children;
  component = cloneWithProps(component, {
    styles: componentStyles
  });
  component.props.children = styleComponentChildren(styles, children);
  return component;
}

module.exports = styleComponent;
