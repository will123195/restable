# restable

Isomorphic REST API pattern for Express

Keep it DRY with a RESTful data access layer that can be called directly server-side *or* via REST API client-side.

[![Build Status](https://travis-ci.org/will123195/restable.svg)](https://travis-ci.org/will123195/restable)

## Install

```
npm install --save restable express
```

## Usage

#### Create your endpoints server-side

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

#### Consume your endpoint server-side (no http)

```js
api.get('books', {
  query: {
    id: 123
  }
}, function (code, data) {
  console.log('book:', data.book)
})
```

#### Expose your endpoints as a REST API server-side

```js
var express = require('express')
var app = express()
app.use('/api', api.rest)
app.listen(8080)
```

#### Consume your endpoint client-side

```js
var client = require('idiot')({
  baseUrl: 'http://localhost:8080/api/'
})
client.get('books?id=123', function (code, data) {
  console.log('book:', data.hello)
})
```

Notice the API can be called on the client-side and server-side exactly the same way. Except server-side is obviously faster because there is no http request!