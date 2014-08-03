/**
 * @jsx React.DOM
 */
define(['react'], function(React) {

  var Tab = React.createClass({

    css: {
      normal: {
        margin: '20px'
      },
      red: {
        color: 'red'
      },
      blue: {
        color: 'blue'
      }
    },

    render: function() {
      var test = true ? this.css.blue : this.css.red;
      return <div className={this.css.normal + test} />;
    }

  });

  return Tab;
});
