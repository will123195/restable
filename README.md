# restable

Isomorphic REST API pattern for Express

[![Build Status](https://travis-ci.org/will123195/restable.svg)](https://travis-ci.org/will123195/restable)

## Install

```
npm install --save restable express
```

## Usage

#### Create your api endpoints

```js
var restable = require('restable')

var hello = {
  get: function ($) {
    $.send({
      hello: $.name
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
    name: 'kitty'
  }
})
```

#### Call your api endpoints directly (no http)

```js
api.get('hello', function (code, data) {
  console.log('hello:', data.hello)
})
```

#### Expose your endpoints as a REST API

```js
var express = require('express')
var app = express()
app.use('/api', api.rest)
app.listen(8080)
```

#### Call your endpoint remotely

```js
var client = require('idiot')({
  baseUrl: 'http://localhost:8080/api/'
})
client.get('hello', function (code, data) {
  console.log('hello:', data.hello)
})
```
