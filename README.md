# documentation-theme-utils

[![Circle CI](https://circleci.com/gh/documentationjs/documentation-theme-utils/tree/master.svg?style=svg)](https://circleci.com/gh/documentationjs/documentation-theme-utils/tree/master)
[![Coverage Status](https://coveralls.io/repos/documentationjs/documentation-theme-utils/badge.svg?branch=master&service=github)](https://coveralls.io/github/documentationjs/documentation-theme-utils?branch=master)

Utilities that help in the process of building theme modules
for documentation.js.

## API

### link

Helper used to automatically link items to global JS documentation or to internal
documentation.

**Parameters**

-   `text` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** text to potentially link
-   `getHref` **\[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]** a function that tries
    to find a URL to point a named link to
-   `description`  

**Examples**

```javascript
link('string').url // => 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String'
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** [mdast](https://www.npmjs.com/package/mdast) node

### formatType

Helper used to format JSDoc-style type definitions into HTML or Markdown.

**Parameters**

-   `node` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** type object in doctrine style
-   `getHref` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a function that tries
    to find a URL to point a named link to

**Examples**

```javascript
formatType({ type: 'NameExpression', name: 'String' })[0].url // => 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String'
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** array of [mdast](https://www.npmjs.com/package/mdast) syntax trees
