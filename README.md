# restable

A Simple Isomorphic REST API Pattern for Express

[![Build Status](https://travis-ci.org/will123195/restable.svg)](https://travis-ci.org/will123195/restable)

Build a server-side REST API that can be called directly *or* via http REST client.

## Install

```
npm install --save restable express
```

## Usage

You'll notice the syntax for consuming your API from the client-side and server-side is identical. Except it's obviously faster from the server-side because there is no http request!

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

## Advanced usage

You might have endpoints that behave differently based on the user that is calling it.

When your endpoint is called via http, the `req` and `res` objects are available. For example, you might be using some sort of authentication middleware:

##### GET /api/my/books
```js
function ($) {
  if (!$.req.authenticated) {
    return $.error(403, 'access denied')
  }
  $.send({
    books: []
  })
}
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
