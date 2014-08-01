IntegratedCSS
===
After integrating HTML into JavaScript by React.js, a logical next step is to do the same for CSS.

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
    return <div css={css}>
        Example
    </div>;
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
    var css = this.state.hover ? "a" : "b";
    return <div className={css}>
        Example
    </div>;
  },

  onMouseOver: function() {
    this.setState({hover: true});
  }

});

```

Usage
---

LICENSE
---
MIT
