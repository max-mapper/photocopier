#!/usr/bin/env node

var photoImport = require('./')

var from = process.argv[2]
var to = process.argv[3]
if (!from || !to) {
  console.log('usage: photo-import <from> <to>')
  process.exit(1)
}

photoImport(from, to, function (err, results) {
  if (err) throw err
  console.log('Done')
})
