module.exports = {

  'a': {
    get: function ($) {
      $.send({
        a: $.abc
      })
    },
    post: function ($) {
      $.send(201, {
        first: $.query.first,
        second: $.body.second
      })
    }
  },

  'a/b': {
    put: function ($) {
      $.error(420, {
        msg: 'wacky'
      })
    },
    delete: function ($) {
      $.error('err!')
    }
  }

}