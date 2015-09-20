# restable

Isomorphic REST API pattern for Express

[![Build Status](https://travis-ci.org/will123195/restable.svg)](https://travis-ci.org/will123195/restable)

Keep it DRY with a RESTful server-side data access layer that can be called directly *or* via REST client.

## Install

```
npm install --save restable express
```

## Usage

#### Create your server-side endpoints

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

#### Expose your endpoints as a REST API

```js
var express = require('express')
var app = express()
app.use('/api', api.rest)
app.listen(8080)
```

Notice the API is identical on client-side and server-side. Except server-side is obviously faster because there is no http request:

#### Consume your endpoint server-side (no http)

```js
api.post('books', function (statusCode, data) {
  if (data.error) {
    console.log(data.error.message)
  }
})

api.get('books', {
  query: {
    id: 123
  }
}, function (statusCode, data) {
  console.log('book:', data.book)
})
```

#### Consume your endpoint client-side

```js
var client = require('idiot')({
  baseUrl: 'http://localhost:8080/api/'
})

client.get('books', {
  query: {
    id: 123
  }
}, function (statusCode, data) {
  console.log('book:', data.book)
})
```

## Advanced usage

You might have endpoints that behave differently based on the user that is calling it.

When your endpoint is called via REST, `req` and `res` objects are available. For example, you might be using some sort of authentication middleware:

GET /api/my/books
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

Oh no! This won't work if we call it directly from the server-side because there is no `req` object. Unless we specify it like this:

GET /my-books.html
```js
app.get('/my-books.html', function (req, res) {
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