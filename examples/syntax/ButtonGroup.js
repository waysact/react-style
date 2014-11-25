/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var ReactStyle = require('react-style');

var ButtonGroupStyles = {

  normalStyle: ReactStyle`
    display: inline;
  `,

  childStyle: ReactStyle`
    borderRadius: 0;
    margin: 0;
  `,

  firstChildStyle: ReactStyle`
    borderTopLeftRadius: 3px;
    borderBottomLeftRadius: 3px;
  `,

  lastChildStyle: ReactStyle`
    borderTopRightRadius: 3px;
    borderBottomRightRadius: 3px;
  `

};

class ButtonGroup {

  render() {
    var children = this.props.children;
    var childrenWithStyle = [];
    for (var i = 0, l = children.length; i  < l; i++) {
      var child = children[i];
      var childProps = child.props;
      childProps.styles = [ButtonGroupStyles.childStyle];
      if (i === 0) {
        childProps.styles.push(ButtonGroupStyles.firstChildStyle);
      }
      if (i === l - 1) {
        childProps.styles.push(ButtonGroupStyles.lastChildStyle);
      }

      childrenWithStyle.push(child);
    }
    return (
      <div styles={ButtonGroupStyles.normalStyle}>
        {childrenWithStyle}
      </div>
    );
  }
}

module.exports = React.createClass(ButtonGroup.prototype);
