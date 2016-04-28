var Syntax = require('doctrine').Syntax,
  globalsDocs = require('globals-docs'),
  u = require('unist-builder');

function t(text) {
  return u('text', text);
}

/**
 * Helper used to automatically link items to global JS documentation or to internal
 * documentation.
 *
 * @param {String} text - text to potentially link
 * @param {function} [getHref] - a function that tries
 * to find a URL to point a named link to
 * @returns {Object} [mdast](https://www.npmjs.com/package/mdast) node
 */
function link(text, getHref, description) {
  var href = (getHref && getHref(text)) || globalsDocs.getDoc(text);
  if (href) {
    // TODO: this is a temporary fix until we drop remark 3.x support,
    // and then we should remove the 'href' property and only
    // have the url property of links
    return u('link', { href: href, url: href }, [u('text', description || text)]);
  }
  return u('text', text);
}

function commaList(getNamedLink, items, start, end, sep) {
  var res = [];
  if (start) {
    res.push(t(start));
  }
  for (var i = 0, iz = items.length; i < iz; ++i) {
    res = res.concat(formatType(items[i], getNamedLink));
    if (i + 1 !== iz) {
      res.push(t(sep || ', '));
    }
  }
  if (end) {
    res.push(t(end));
  }
  return res;
}

function decorate(formatted, str, prefix) {
  if (prefix) {
    return [t(str)].concat(formatted);
  }
  return formatted.concat(t(str));
}

/**
 * Helper used to format JSDoc-style type definitions into HTML or Markdown.
 *
 * @name formatType
 * @param {Object} node - type object in doctrine style
 * @param {function} getHref - a function that tries
 * to find a URL to point a named link to
 * @returns {Object[]} array of [mdast](https://www.npmjs.com/package/mdast) syntax trees
 * @example
 * var x = { type: 'NameExpression', name: 'String' };
 * // in template
 * // {{ type x }}
 * // generates String
 */
function formatType(node, getHref) {
  var result = [];

  if (!node) {
    return [];
  }

  switch (node.type) {
  case Syntax.NullableLiteral:
    return [t('?')];
  case Syntax.AllLiteral:
    return [t('Any')];
  case Syntax.NullLiteral:
    return [t('null')];
  case Syntax.VoidLiteral:
    return [t('void')];
  case Syntax.UndefinedLiteral:
    return [link('undefined', getHref)];
  case Syntax.NameExpression:
    return [link(node.name, getHref)];
  case Syntax.ParameterType:
    return [t(node.name + ': ')].concat(formatType(node.expression, getHref));

  case Syntax.TypeApplication:
    return formatType(node.expression, getHref)
      .concat(commaList(getHref, node.applications, '<', '>'));
  case Syntax.UnionType:
    return commaList(getHref, node.elements, '(', ')', ' | ');
  case Syntax.ArrayType:
    return commaList(getHref, node.elements, '[', ']');
  case Syntax.RecordType:
    return commaList(getHref, node.fields, '{', '}');

  case Syntax.FieldType:
    if (node.value) {
      return [t(node.key + ': ')].concat(formatType(node.value, getHref));
    }
    return [t(node.key)];

  case Syntax.FunctionType:
    result = [t('function (')];

    if (node['this']) {
      if (node['new']) {
        result.push(t('new: '));
      } else {
        result.push(t('this: '));
      }

      result = result.concat(formatType(node['this'], getHref));

      if (node.params.length !== 0) {
        result.push(t(', '));
      }
    }

    result = result.concat(commaList(getHref, node.params, '', ')'));

    if (node.result) {
      result = result.concat([t(': ')].concat(formatType(node.result, getHref)));
    }
    return result;

  case Syntax.RestType:
    // note that here we diverge from doctrine itself, which
    // lets the expression be omitted.
    return decorate(formatType(node.expression, getHref), '...', true);
  case Syntax.OptionalType:
    return decorate(decorate(formatType(node.expression, getHref), '[', true), ']').concat(
        node.default ? t('(default ' + node.default + ')') : []);
  case Syntax.NonNullableType:
    return decorate(formatType(node.expression, getHref), '!', node.prefix);
  case Syntax.NullableType:
    return decorate(formatType(node.expression, getHref), '?', node.prefix);

  default:
    throw new Error('Unknown type ' + node.type);
  }
}

module.exports.link = link;
module.exports.formatType = formatType;
