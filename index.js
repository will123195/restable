var api = module.exports = function api (opts) {
  if (!(this instanceof api)) {
    return new api(opts)
  }
  this.opts = opts || {}
  this.opts.helpers = this.opts.helpers || {}
  this.resources = opts.resources || {}
  this.rest = require('./lib/rest').bind(this)()

}

api.prototype.get = function (resource, opts, cb) {
  this.run('get', resource, opts, cb)
}

api.prototype.post = function (resource, opts, cb) {
  this.run('post', resource, opts, cb)
}

api.prototype.put = function (resource, opts, cb) {
  this.run('put', resource, opts, cb)
}

api.prototype.delete = function (resource, opts, cb) {
  this.run('delete', resource, opts, cb)
}

api.prototype.run = function (method, resource, opts, cb) {
  opts = opts || {}
  cb = cb || function () {}
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  var $ = Object.assign({}, this.opts.helpers, opts)
  $.send = function (code, response) {
    if (typeof response === 'undefined') {
      response = code
      code = 200
    }
    cb(code, response)
  }
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
    cb(code, response)
  }
  if (!this.resources[resource]
    || !this.resources[resource][method]) {
    return cb(404, {
      message: 'Not found.'
    })
  }
  this.resources[resource][method]($)
}
