IntegratedCSS
===
After integrating HTML into JavaScript by [React.js](http://github.com/facebook/react), a logical next step is to do the same for CSS.

Build with help of the awesome [recast](http://github.com/benjamn/recast) library.

Example
---
```
var Button = React.createClass({

  css: {
    state1: {
      backgroundColor: 'black'
    },
    state2: {
      backgroundColor: 'white'
    }
  }

  getInitialState: function() {
    return {
      hover: false
    };
  },

  render: function() {
    var css = this.state.hover ? this.css.state2 : this.css.state1;
    return React.DOM.div({className: css});
  },

  onMouseOver: function() {
    this.setState({hover: true});
  }

});
```

Turns into:

```
css:
---
.a {
  background-color: 'black';
}
.b  {
  background-color: 'white';
}

JavaScript
---
var Button = React.createClass({

  getInitialState: function() {
    return {
      hover: false
    };
  },

  render: function() {
    var css = this.state.hover ? " a" : " b";
    return React.DOM.div({className: css});
  },

  onMouseOver: function() {
    this.setState({hover: true});
  }

});

```

Why?
---
CSS is problematic to maintain.

What does it actually do?
---
- remove the CSS block
- connect the (something.)css.something blocks to css
- create CSS with annoyingly small CSS className selectors
- isn't smart about actual references to the css object

TODO
---
- fix the generation of CSS classNames to support more than 1 character classNames

Usage
---
```
node TransformerCLI.js --input=example/**/*.js --output=build/ --css=build/styling/lala.css
```

LICENSE
---
MIT
