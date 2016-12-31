var fs = require('fs')
var path = require('path')
var events = require('events')
var mv = require('mv')
var glob = require('glob')
var dateFormat = require('dateformat')
var parallel = require('run-parallel-limit')
var RAWS = ['*.ARW']

module.exports = function (from, to, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  var emitter = new events.EventEmitter()
  glob('+(' + RAWS.join('|') + ')', {cwd: from, nocase: true, matchBase: true}, function (err, results) {
    if (err) return cb(err)
    emitter.emit('files', results)
    var todo = results.map(function (file) {
      return function (cb) {
        var fromPath = path.join(from, file)
        fs.stat(fromPath, function (err, stat) {
          if (err) return cb(err)
          var year = dateFormat(stat.birthtime, 'yyyy')
          var month = dateFormat(stat.birthtime, 'mm')
          var date = dateFormat(stat.birthtime, 'dd')
          var base = path.basename(file)
          var toPath = path.join(to, year, month, date + '-' + base)
          mv(fromPath, toPath, {mkdirp: true, clobber: false}, function (err) {
            if (err) return cb(err)
            emitter.emit('progress', toPath)
            cb()
          })
        })
      }
    })
    parallel(todo, 5, cb)
  })
  return emitter
}