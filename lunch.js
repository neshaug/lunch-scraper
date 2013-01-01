#!/usr/bin/env node

/*jslint node: true, es5: true*/

'use strict';

var fs = require('fs'),
  moment = require('moment'),
  path = require('path'),
  request = require('request'),
  $ = require('jquery');

if (process.argv.length < 3) {
  console.log('usage:', process.argv.join(' '), '<path>');
  process.exit(1);
}

request('http://www.dagbladet.no/tegneserie/lunch/', function (e, r, body) {
  var img, imageUrl, date, savePath, filePath;

  savePath = process.argv[2];

  if (!e && r.statusCode === 200) {
    img = $(body).find('img#lunch-stripe');
    imageUrl = img.attr('src');
    date = moment().format('YYYY-MM-DD');
    filePath = path.join(savePath, date + '.gif');
    fs.exists(filePath, function (exists) {
      if (!exists) {
        request(imageUrl).pipe(fs.createWriteStream(filePath));
      }
    });
  } else {
    console.log('Failed to scrape:', e);
  }
});
