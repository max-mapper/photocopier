var fs = require('fs')
var path = require('path')
var test = require('tape')
var cptar = require('cptar')
var rimraf = require('rimraf')
var photoImport = require('../')

var fixtures = __dirname + '/test-photos'
var from = __dirname + '/photos'
var to = __dirname + '/copied'

rimraf.sync(from)
rimraf.sync(to)

test('setup', function (t) {
  cptar(fixtures, from, function (err) {
    t.ifErr(err)
    t.notOk(fs.existsSync(path.join(to)))
    t.end()
  })
})

test('copies ARW', function (t) {
  photoImport(from, to, function (err, results) {
    t.ifErr(err)
    t.ok(fs.existsSync(path.join(to, '1.ARW')))
    t.ok(fs.existsSync(path.join(to, '2.ARW')))
    t.ok(fs.existsSync(path.join(to, 'sub', '3.ARW')))
    t.ok(fs.existsSync(path.join(to, 'sub', 'subsub', '4.ARW')))
    t.notOk(fs.existsSync(path.join(to, '1.txt')))
    t.end()
  })
})
