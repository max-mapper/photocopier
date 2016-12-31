var fs = require('fs')
var path = require('path')
var mv = require('mv')
var glob = require('glob')
var parallel = require('run-parallel-limit')

var RAWS = ['*.ARW']

module.exports = function (from, to, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  glob('+(' + RAWS.join('|') + ')', {cwd: from, nocase: true, matchBase: true}, function (err, results) {
    if (err) return cb(err)
    var todo = results.map(function (file) {
      return function (cb) {
        mv(path.join(from, file), path.join(to, file), {mkdirp: true, clobber: false}, cb)
      }
    })
    parallel(todo, 5, cb)
  })
}