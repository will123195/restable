# restable

A Simple Isomorphic REST API Pattern for Express

[![Build Status](https://travis-ci.org/will123195/restable.svg)](https://travis-ci.org/will123195/restable)

Build a server-side REST API that can be called directly *or* via http REST client.

## Install

```
npm install --save restable express
```

## Usage

The syntax for consuming your API from the client-side and server-side is identical, but it's obviously faster from the server-side because there is no http request!

#### Create your API

```js
var restable = require('restable')
var db = require('./db')

var books = {
  get: function ($) {
    $.send({
      book: $.db.getBook($.query.id)
    })
  },
  post: function ($) {
    // $.body
    // $.query
    $.error('POST not allowed')
  }
}

var api = restable({
  resources: {
    books: books
  },
  helpers: {
    db: db
  }
})
```

#### Expose your API as a REST service

```js
var express = require('express')
var app = express()
app.use('/api', api.rest)
app.listen(8080)
```

#### Consume your API with http REST client

```js
var client = require('idiot')({
  baseUrl: 'http://localhost:8080/api/'
})

// GET /api/books?id=123
client.get('books', {
  query: {
    id: 123
  }
}, function (statusCode, data) {
  console.log('book:', data.book)
})
```

#### Consume your API directly (no http)

```js
var api = restable(opts)

// GET /api/books?id=123 (but no http!)
api.get('books', {
  query: {
    id: 123
  }
}, function (statusCode, data) {
  console.log('book:', data.book)
})

// POST /api/books (but no http!)
api.post('books', function (statusCode, data) {
  if (data.error) {
    console.log(data.error.message)
  }
})
```


## Options

### restable(opts)
*opts*
- **resources** - an object whose keys are resource names
    - a resource is an object of `get`, `post`, `put` and/or `delete` methods
- **helpers** - an object whose keys are helper names
    - a helper is a value that is available in all resource methods
    - passing in your `db` as a helper is recommended

Your resource methods need to call either `send(json)` or `error(message)`.

```js
var myResource = {
  get: function ($) {
    // $.myHelper
    // $.myOtherHelper

    // $.send(json)
    // $.send(200, json)

    // $.error(message)
    // $.error(obj)
    // $.error(400, message)
    // $.error(400, obj)
  }
}
```


## Advanced usage

You might have endpoints that behave differently based on the user that is calling it.

When your endpoint is called via http, the `req` and `res` objects are available. For example, you might be using some sort of authentication middleware:

##### GET /api/my/books
```js
var api = restable({
  resources: {
    'my/books': {
      get: function ($) {
        if (!$.req.authenticated) {
          return $.error(403, 'access denied')
        }
        $.send({
          books: []
        })
      }
    }
  }
})
var server = api.rest.listen(8080)
```

But oh no! This won't work if we call it from the server-side without a `req` object. But it's cool since we can specify `req` like this:

##### GET /my-books.html
```js
// express route
app.get('/my-books.html', function (req, res) {
  // get the books for the logged in user
  api.get('my/books', {
    req: req
  }, function (statusCode, data) {
    if (statusCode === 403) {
      return res.send(data.error.message)
    }
    res.send('You have ' + data.books.length + ' books.')
  })
})
```
