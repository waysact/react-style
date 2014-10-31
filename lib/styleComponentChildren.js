'use strict';

var cloneWithProps = require('react/lib/cloneWithProps');
var ReactChildren  = require('react/lib/ReactChildren');

function styleComponentChildren(styles, children) {
  var childrenStyles = [];
  var firstChildStyles = [];
  var lastChildStyles = [];

  if (!Array.isArray(styles)) {
    styles = [styles];
  }

  for (var i = 0, len = styles.length; i < len; i++) {
    if (!styles[i] || !styles[i].children) {
      continue;
    }
    if (styles[i].children.children) {
      childrenStyles.push(styles[i].children.children);
    }
    if (styles[i].children.firstChild) {
      firstChildStyles.push(styles[i].children.firstChild);
    }
    if (styles[i].children.lastChild) {
      lastChildStyles.push(styles[i].children.lastChild);
    }
  }

  var length = ReactChildren.count(children);
  var strings = 0;
  return ReactChildren.map(children, function(child, _idx) {
    if (typeof child === 'string') {
      strings++;
      return child;
    }
    if (child === null) {
      return null;
    }

    var idx = _idx - strings;
    var childChildren = child.props.children;
    if (idx === 0 && firstChildStyles.length > 0) {
      child = cloneWithProps(
        child,
        {styles: [].concat(child.props.styles || [], firstChildStyles)}
      );
    }
    else if (idx + strings === length - 1 && lastChildStyles.length > 0) {
      child = cloneWithProps(
        child,
        {styles: [].concat(child.props.styles, lastChildStyles)}
      );
    }
    else {
      child = cloneWithProps(
        child,
        {styles: [].concat(child.props.styles, childrenStyles)}
      );
    }
    return child;
  });
}

module.exports = styleComponentChildren;
