var autoprefixer = require('autoprefixer-core');
var camelizeStyleName = require('react/lib/camelizeStyleName');
var instance = autoprefixer({ browsers: process.argv.slice(2) });
var prefixes = instance.prefixes();

var propPrefixes = {};
var allPrefixes = {};

function addPrefixes(prefixes) {
    for (var i=0, len=prefixes.length; i<len; ++i) {
        var prefix = prefixes[i];
        if (!(prefix in allPrefixes)) {
            allPrefixes[prefix] = 1 << Object.keys(allPrefixes).length;
        }
    }
}

for (var name in prefixes.add) {
    var data = prefixes.add[name];
    if (name[0] !== '@' && data.prefixes) {
        addPrefixes(data.prefixes);
    }

    var valuePrefixes = {};
    if (data.values) {
        for (var i=0, len=data.values.length; i<len; ++i) {
            var value = data.values[i];
            valuePrefixes[value.name] = { prefixes: value.prefixes };
            addPrefixes(value.prefixes);
        }
    }

    if ((name[0] !== '@' && data.prefixes) || Object.keys(valuePrefixes).length) {
        propPrefixes[camelizeStyleName(name)] = {
            prefixes: (data.prefixes || []),
            values: valuePrefixes
        };
    }
}

function compressPrefixes(object) {
    for (var name in object) {
        if (object[name].values) {
            compressPrefixes(object[name].values);
        }

        var prefixes = object[name].prefixes;
        var sum = 0;
        for (var i=0, len=prefixes.length; i<len; ++i) {
            sum += allPrefixes[prefixes[i]];
        }
        if (object[name].values && Object.keys(object[name].values).length) {
            object[name] = [ sum, object[name].values ];
        } else {
            object[name] = sum;
        }
    }
}

compressPrefixes(propPrefixes);

process.stdout.write(JSON.stringify({
    prefix: Object.keys(allPrefixes),
    props: propPrefixes
}));
