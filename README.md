# restable

Isomorphic REST API pattern for Express

Save time by writing your data access layer once and call the methods directly server-side *or* via REST API client-side.

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

var hello = {
  get: function ($) {
    $.send({
      hello: $.db.getSomething()
    })
  },
  post: function ($) {
    $.error('POST not allowed')
  }
}

var api = restable({
  resources: {
    hello: hello
  },
  helpers: {
    db: db
  }
})
```

#### Consume your endpoint server-side (no http)

```js
api.get('hello', function (code, data) {
  console.log('hello:', data.hello)
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
client.get('hello', function (code, data) {
  console.log('hello:', data.hello)
})
```

Notice the code for client-side and server-side API calls are exactly the same. Except server-side is obviously faster because there is no http request!