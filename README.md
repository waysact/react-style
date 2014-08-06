React-style
===============
[![Code Climate](https://codeclimate.com/github/SanderSpies/IntegratedStyle/badges/gpa.svg)](https://codeclimate.com/github/SanderSpies/IntegratedStyle)

After integrating HTML into JavaScript by [React.js][], a logical next step is
to do the same for CSS.

Build with help of the awesome [recast][] library.

Example
-------

```
var React           = require('react/addons')
var IntegratedStyle = require('react-style')
var vars            = require('./vars')

var Button = React.createClass({

  normalStyle: IntegratedStyle(function() {
    return {
      backgroundColor: vars.orange
    }
  }),

  activeStyle: IntegratedStyle(function() {
    if (this.state.active) {
      return {
        color: 'yellow',
        padding: '10px'
      }
    }
  }),

  getInitialState: function() {
    return {
      active: false
    }
  },

  render: function() {
    var styles = [
      this.normalStyle(),
      this.activeStyle()
    ]
    return (
      <div styles={styles} onClick={this.onClick}>
        Hello, I'm styled
      </div>
    )
  },

  onClick: function() {
    this.setState({active: !this.state.active})
  }

})
```

Turns into the following CSS:

```
.a {
  background-color: 'orange';
}
```

while the JavaScript code itself gets transformed into:
```
var React           = require('react/addons')
var IntegratedStyle = require('react-style')
var vars            = require('./vars')

var Button = React.createClass({

  normalStyle: function() {
    return " a"
  },

  activeStyle: IntegratedStyle(function() {
    if (this.state.active) {
      return {
        color: 'yellow',
        padding: '10px'
      }
    }
  }),

  getInitialState: function() {
    return {
      active: false
    }
  },

  render: function() {
    var styles = [
      this.normalStyle(),
      this.activeStyle()
    ]
    return (
      <div styles={styles} onClick={this.onClick}>
        Hello, I'm styled
      </div>
    )
  },

  onClick: function() {
    this.setState({active: !this.state.active})
  }

})
```

Note how the `normalStyle` style declaration is extracted into a CSS class.

Motivation
----------

CSS is problematic to maintain and components give all the borders you actually
need.

What does it actually do?
-------------------------

At runtime:

1. It adds style declaration to React components. Style declarations are regular
   methods which are decorated with `IntegratedStyle` decorator and return
   regular style rules.
2. It adds `styles` prop to all React.DOM components which allows to add styles
   to a component from a style declaration.

At code transformation:

1. It finds all component methods wrapped into `IntegratedStyle()` decorator.
2. It checks if such methods have references to `this`.

  2.1. If method has no reference to `this` it is executed and result is used to
       generated CSS class with a corresponding ruleset.

  2.2. If method has reference to `this` it is left as is, as it will be used to
       generate inline styles.

Usage
-----

TODO describe how to integrate react-style with [webpack][].

Other options
-------------

- [RCSS](https://github.com/chenglou/rcss)
- [ReactStyles](https://github.com/hedgerwang/react-styles)
- [react-css](https://github.com/elierotenberg/react-css)

Also there is this proposal from the React.js team:

- [Inline Style Extension](https://github.com/reactjs/react-future/blob/master/04 - Layout/Inline Style Extension.md)

LICENSE
-------

MIT

[React.js]: http://github.com/facebook/react
[recast]: http://github.com/benjamn/recast
[webpack]: https://webpack.github.io
