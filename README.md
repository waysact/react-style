# React Style

[![Build Status](https://travis-ci.org/js-next/react-style.svg?branch=master)](https://travis-ci.org/js-next/react-style)
[![Code Climate](https://codeclimate.com/github/js-next/react-style/badges/gpa.svg)](https://codeclimate.com/github/js-next/react-style)

React Style is an approach for styling [React][] components.

Define styles using full power of JavaScript:

    var ReactStyle = require('react-style')

    var styles = ReactStyle({
      color: 'red',
      backgroundColor: 'white'
    })

Style React components:

    var React = require('react')

    var HelloWorld = React.createClass({

      render() {
        var dynamicStyles = ReactStyle({color: this.props.color})
        return <div styles={[styles, dynamicStyles]}>Hello, world!</div>
      }
    })

Now with these two lines you get your application styled and running:

    ReactStyle.inject()
    React.renderComponent(<HelloWorld color="red" />, document.body)

Styles which are found to be at the module level will be compiled to CSS classes
and injected into DOM as `<style>` element. Dynamic styles (as `dynamicStyles`
is defined inside `render()` method) will be applied to DOM as inline styles.

## Extracting styles into CSS at build time

There's [React Style Webpack plugin][] which extends [Webpack][] with the
ability to extract styles from your application at build time. The result is a
`bundle.css` file which can be added to `<head>`.

## Syntax helpers for writing styles

There's [React Style syntax][] which allows you to write styles like this:

    var styles = ReactStyle`
      color: red;
      background-color: white;
    `

And have it transformed into:

    var styles = ReactStyle({
      color: 'red',
      backgroundColor: 'white'
    })

This syntax is consistent with [ES6 tagged template literal][es6-templ]

The syntax helpers are convenient when transitioning a large CSS
code base to React Style. It makes it possible to directly copy paste styles 
from your CSS and later refactor them into a more modular form.

License
---
MIT

[Webpack]: https://webpack.github.io
[React]: https://facebook.github.io/react/
[React Style Webpack plugin]: https://github.com/js-next/react-style-webpack-plugin
[React Style syntax]: https://github.com/js-next/react-style-syntax
[es6-templ]: http://tc39wiki.calculist.org/es6/template-strings/
