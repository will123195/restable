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
        $.error = function (code, message) {
          if (!message) {
            message = code
            code = 400
          }
          res.status(code)
          res.send({
            error: {
              message: message
            }
          })
        }
        $.send = function () {
          res.send.apply(res, arguments)
        }
        action($)
      })
    })
  })
  return app
}