#!/usr/bin/env node
'use strict';
var fs = require('fs');
var argv = require('yargs').argv;
var glob = require('glob');

var Transformer = require('./Transformer');

var input = argv.input;
var output = argv.output;

glob(input, {}, function(err, fileNames) {
  var inputFiles = [];
  for (var i = 0, l = fileNames.length; i < l; i++) {
    var fileName = fileNames[i];
    var fileContents = fs.readFileSync(fileName);
    inputFiles.push({
      name: fileName,
      contents: fileContents
    });
  }
  var transformation = Transformer.transformFiles(inputFiles);

  // TODO: connect to proper CSS converter
  fs.writeFile(output + 'css.css', JSON.stringify(transformation.css), function(err) {
    if (err) {
      console.log('Something went wrong when trying to write the css file:', err);
    }
  });

  for (var i = 0, l = transformation.files.length; i < l; i++) {
    var file = transformation.files[i];
    fs.writeFile(output + file.name, file.contents, function(err) {
      if (err) {
        console.log('Something went wrong when trying to write the ' + file.name + ' file:', err);
      }
    });
  }
});