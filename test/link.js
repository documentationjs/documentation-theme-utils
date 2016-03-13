'use strict';

var link = require('../index').link,
  remark = require('remark'),
  parse = require('doctrine').parse,
  test = require('tap').test;

test('link', function (t) {
  function localURL(text) {
    if (text === 'Bar') return '#Bar';
  }

  [
    ['Array', '[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)'],
    ['Foo', 'Foo'],
    ['Foo', 'Foo', localURL],
    ['Bar', '[Bar](#Bar)', localURL],
    ['Bar', '[text](#Bar)', localURL, 'text']
  ].forEach(function (example) {
    t.deepEqual(remark().stringify(link(example[0], example[2], example[3])), example[1], example[0]);
  });

  t.end();
});
