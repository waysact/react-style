#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;
var glob = require('glob');

var Transformer = require('./Transformer');

var input = argv.input;
var output = argv.output;
var cssOutput = argv.css;

function createFolders(filePath) {
  var folderName = path.dirname(filePath);
  var folders = folderName.split(path.sep);
  var currPath = [];
  for (var j = 0, l2 = folders.length; j < l2; j++) {
    currPath.push(folders[j]);
    if (!fs.existsSync(currPath.join(path.sep))) {
      fs.mkdirSync(currPath.join(path.sep));
    }
  }
}

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

  createFolders(cssOutput);

  fs.writeFile(cssOutput, transformation.css, function(err) {
    if (err) {
      console.log('Something went wrong when trying to write the css file:', err);
    }
  });

  for (var i = 0, l = transformation.files.length; i < l; i++) {
    var file = transformation.files[i];
    createFolders(output + file.name);

    fs.writeFile(output + file.name, file.contents, function(err) {

      if (err) {
        console.log('Something went wrong when trying to write the ' + file.name + ' file:', err);
      }
    });
  }
});