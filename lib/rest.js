var express = require('express')
var bodyParser = require('body-parser')

module.exports = function () {
  var self = this
  var app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.set('json spaces', 2)

  Object.keys(self.resources).forEach(function (resource) {
    var actions = self.resources[resource]
    Object.keys(actions).forEach(function (method) {
      var uri = '/' + resource
      app[method](uri, function (req, res) {
        var action = actions[method]
        var $ = self.opts.helpers
        $.req = req
        $.res = res
        $.body = req.body || {}
        $.query = req.query || {}
        $.error = function (code, response) {
          if (typeof response === 'undefined') {
            response = code
            code = 400
          }
          if (typeof response === 'string') {
            var message = response
            response = {
              error: {
                message: message
              }
            }
          } else {
            var obj = response
            response = {
              error: obj
            }
          }
          res.status(code)
          res.json(response)
        }
        $.send = function (code, response) {
          if (typeof response === 'undefined') {
            response = code
            code = 200
          }
          res.status(code)
          res.json(response)
        }
        action($)
      })
    })
  })
  return app
}