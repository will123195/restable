var test = require('tape')
var express = require('express')
var restable = require('..')
var idiot = require('idiot')

var api
var client
var app
var server

test('create api', function (t) {
  api = restable({
    resources: require('./resources'),
    helpers: {
      abc: 'xyz'
    }
  })
  t.end()
})

test('get', function (t) {
  api.get('a', function (code, data) {
    t.equal(code, 200)
    t.equal(data.a, 'xyz')
    t.end()
  })
})

test('delete', function (t) {
  api.delete('a/b', function (code, data) {
    t.equal(code, 400)
    t.equal(data.error.message, 'err!')
    t.end()
  })
})

test('put', function (t) {
  api.put('a/b', function (code, data) {
    t.equal(code, 420)
    t.equal(data.error.msg, 'wacky')
    t.end()
  })
})

test('post', function (t) {
  api.post('a', {
    query: {
      first: 'one'
    },
    body: {
      second: 'two'
    },
  }, function (code, data) {
    t.equal(code, 201)
    t.equal(data.first, 'one')
    t.equal(data.second, 'two')
    t.end()
  })
})

test('404', function (t) {
  api.get('b', function (code, data) {
    t.equal(code, 404)
    t.end()
  })
})

test('start rest service', function (t) {
  app = express()
  app.use('/api', api.rest)
  server = app.listen(8080)
  client = idiot({
    baseUrl: 'http://localhost:8080/api/'
  })
  t.end()
})

test('GET', function (t) {
  client.get('a', function (code, data) {
    t.equal(code, 200)
    t.equal(data.a, 'xyz')
    t.end()
  })
})

test('DELETE', function (t) {
  client.delete('a/b', function (code, data) {
    t.equal(code, 400)
    t.equal(data.error.message, 'err!')
    t.end()
  })
})

test('PUT', function (t) {
  client.put('a/b', function (code, data) {
    t.equal(code, 420)
    t.equal(data.error.msg, 'wacky')
    t.end()
  })
})

test('POST', function (t) {
  client.post('a', {
    query: {
      first: 'one'
    },
    body: {
      second: 'two'
    },
  }, function (code, data) {
    t.equal(code, 201)
    t.equal(data.first, 'one')
    t.equal(data.second, 'two')
    t.end()
  })
})

test('404', function (t) {
  client.get('b', function (code, data) {
    t.equal(code, 404)
    t.end()
  })
})

test('exit', function (t) {
  server.close()
  t.end()
})
