/**
 * @jsx React.DOM
 */
define(['react', 'react-style'], function(React, ReactStyle) {

  var Tab = React.createClass({

    redStyle: ReactStyle(function() {
      return {
        color: this.state.red
      };
    }),

    blueStyle: ReactStyle(function() {
      return {
        color: 'blue'
      };
    }),

    render: function() {
      var styles = true ? this.blueStyle() : this.redStyle();
      return <div styles={style} />;
    }

  });

  return Tab;
});
