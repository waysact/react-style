IntegratedCSS
===
After integrating HTML into JavaScript by [React.js](http://github.com/facebook/react), a logical next step is to do the same for CSS.

Build with help of the awesome [recast](http://github.com/benjamn/recast) library.

Example
---
```
var Button = React.createClass({

  css: function() {
    var vars = require('./vars'); // vars.js would export a black variable
    return {
      state1: {
        backgroundColor: vars.black
      },
      state2: {
        backgroundColor: 'white'
      }
    }
  },

  getInitialState: function() {
    return {
      hover: false
    };
  },

  render: function() {
    var css = this.state.hover ? this.css().state2 : this.css().state1;
    return <div className={css}>Example</div>;
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
    return <div className={css}>Example</div>;
  },

  onMouseOver: function() {
    this.setState({hover: true});
  }

});
```

Why?
---
CSS is problematic to maintain and components give all the borders you actually need.

What does it actually do?
---
- It takes out the ``css`` function and transform it into plain CSS
- The ``css`` function is executed on its own, it has no reference to 'this'
- connect the (something.)css.something blocks to CSS
- create CSS with annoyingly small CSS className selectors (3 characters max - up to 140608 classes)
- CSS is coupled to the component and can be passed to another component via props (``aProp={this.css.something}``)
- isn't smart about actual references to the CSS object

Usage
---
```
node TransformerCLI.js --input=example/**/*.js --output=build/ --css=build/styling/lala.css
```

LICENSE
---
MIT
