/**
 * @jsx React.DOM
 */
define(['react', 'integratedstyle'], function(React, IntegratedStyle) {

  var Tab = React.createClass({

    redStyle: IntegratedStyle(function() {
      return {
        color: this.state.red
      };
    }),

    blueStyle: IntegratedStyle(function() {
      return {
        color: 'blue'
      };
    }),

    render: function() {
      var style = true ? this.blueStyle() : this.redStyle();
      return <div style={style} />;
    }

  });

  return Tab;
});
