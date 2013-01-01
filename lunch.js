#!/usr/bin/env node

/*jslint node: true, es5: true*/

'use strict';

var fs = require('fs'),
  moment = require('moment'),
  path = require('path'),
  Requester = require('requester'),
  requester = new Requester(),
  $ = require('jquery');

if (process.argv.length < 3) {
  console.log('usage:', process.argv.join(' '), '<path>');
  process.exit(1);
}

requester.get('http://www.dagbladet.no/tegneserie/lunch/', function (html) {
  if (this.statusCode !== 200) {
    console.log('Request failed:', this.statusCode);
    return;
  }
  var savePath = process.argv[2],
    imageUrl = $(html).find('img#lunch-stripe').attr('src'),
    date = moment().format('YYYY-MM-DD'),
    filePath = path.join(savePath, date + '.gif');
  fs.exists(filePath, function (exists) {
    if (!exists) {
      var options = { encoding: 'binary' };
      requester.get(imageUrl, options, function (data) {
        fs.writeFileSync(filePath, new Buffer(data, options.encoding));
      });
    }
  });
});
