0.4 release notes
===
With 0.4.0 we're introducing some breaking changes which will bring react-style
closer to its initial goal of making styling maintainable. We fully embrace the
require-tree to determine the ordering of styling instead of the specificity
hack. This means we will get nice selectors without pollution - but also means
that we need to drop support for pseudo classes as they break the require-tree.

Besides embracing the require-tree, we also want certain functionality to be
implemented inside a React component’s render function instead of inside React
Style. Both media queries and animation will therefore not be implemented.
Media queries are easy to implement within JavaScript. Animations should be
solved with renderAnimationFrame and recalling the render function, instead
of using CSS animations. Also the dropped pseudo classes are easy to replace
with JavaScript.

To further improve the developer experience we now generate readable classNames
for development, and tiny classNames for production. By creating readable
classNames you are able to find the correct location relatively fast during
development. Production classNames are very small, they take up 1 to 3
characters, and therefore don’t waste a lot of resources.