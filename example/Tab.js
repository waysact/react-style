/**
 * @jsx React.DOM
 */
define(['react'], function(React) {

  var Tab = React.createClass({

    redStyle: function() {
      return {
        color: this.state.red
      };
    },

    blueStyle: function() {
      return {
        color: 'blue'
      };
    },

    render: function() {
      var className = true ? this.blueStyle() : this.redStyle();
      return <div className={className} />;
    }

  });

  return Tab;
});
