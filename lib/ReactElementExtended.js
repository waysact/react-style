'use strict';

var ReactElement              = require('react/lib/ReactElement');
var assign                    = require("react/lib/Object.assign");

var applyStyles               = require('./applyStyles');

function buildProps(props) {
	var builtProps = {
		className: props.className || null,
		style: props.style ? assign({}, props.style) : null,
		styles: undefined
	};
	applyStyles(builtProps, props.styles);
	return builtProps;
}

var originalCreateElement = ReactElement.createElement;
ReactElement.createElement = function(type, props, ...children) {
	// slice executed in a different function for performance
	var tempArgs = arguments;
	var args = slice(tempArgs);
	if (props && typeof type === 'string') {
		props = assign(props, buildProps(props));
	}

	return originalCreateElement.apply(null, [type, props].concat(children));
};

function slice(args) {
	return Array.prototype.slice.call(args, 0);
}
