/*eslint max-len: 0 */
'use strict';

var formatType = require('../index').formatType,
  link = require('../index').link,
  remark = require('remark'),
  parse = require('doctrine').parse,
  test = require('tap').test;

test('formatType', function (t) {
  [
    ['Foo', 'Foo'],
    ['null', 'null'],
    ['null', 'null'],
    ['*', 'Any'],
    ['Array|undefined', '([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) \\| [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined))'],
    ['Array<number>', '[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>'],
    ['number!', '[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)!'],
    ['function(string, boolean)', 'function ([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean))'],
    ['function(string, boolean): number', 'function ([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)): [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)'],
    ['function()', 'function ()'],
    ['function(this:something, string)', 'function (this: something, [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))'],
    ['function(new:something)', 'function (new: something)'],
    ['{myNum: number, myObject}', '{myNum: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), myObject}'],
    ['[string,]', '\\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]'],
    ['number?', '[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?'],
    ['?number', '?[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)'],
    ['?', '?'],
    ['void', 'void'],
    ['function(a:b)', 'function (a: b)'],
    ['function(a):void', 'function (a): void'],
    ['number=', '\\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]'],
    ['...number', '...[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)'],
    ['undefined', '[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)']
  ].forEach(function (example) {
    t.deepEqual(remark().stringify({
      type: 'paragraph',
      children: formatType(
          parse('@param {' + example[0] + '} a', { sloppy: true }).tags[0].type)
    }), example[1], example[0]);
  });

  t.deepEqual(remark().stringify({
    type: 'paragraph',
    children: formatType(
        parse('@param {number} [a=1]', { sloppy: true }).tags[0].type)
  }), '\\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]', 'default');

  t.deepEqual(remark().stringify({
    type: 'paragraph',
    children: formatType(
      parse('@param {Foo} a', { sloppy: true }).tags[0].type, function () { return '#Foo' })
  }), '[Foo](#Foo)', 'with getHref');

  t.deepEqual(formatType(), [], 'empty case');

  t.throws(function () {
    formatType({});
  });

  t.end();
});
