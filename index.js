var fs = require('fs')
var path = require('path')
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
  glob('+(' + RAWS.join('|') + ')', {cwd: from, nocase: true, matchBase: true}, function (err, results) {
    if (err) return cb(err)
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
          mv(fromPath, toPath, {mkdirp: true, clobber: false}, cb)            
        })
      }
    })
    parallel(todo, 5, cb)
  })
}