#!/usr/bin/env node

var photoImport = require('./')
var ProgressBar = require('progress')

var from = process.argv[2]
var to = process.argv[3]
if (!from || !to) {
  console.log('usage: photo-import <from> <to>')
  process.exit(1)
}

var bar
var total

var importer = photoImport(from, to, function (err, results) {
  if (err) throw err
  console.log('Moved', total, 'files')
})

importer.on('files', function (files) {
  total = files.length
  bar = new ProgressBar('Moving [:bar] :percent', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: total
  })
})

importer.on('progress', function (file) {
  bar.tick(1)
})
