# React Style

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

There's also a [React Style Webpack plugin][] which extends [Webpack][] with the
ability to extract styles from your application at build time. The result is a
`bundle.css` file which can be added to `<head>`.

[Webpack]: https://webpack.github.io
[React]: https://facebook.github.io/react/
[React Style Webpack plugin]: https://github.com/js-next/react-style-webpack-plugin
