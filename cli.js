#!/usr/bin/env node

var photoImport = require('./')

var from = process.argv[2]
var to = process.argv[3]
if (!from || !to) throw new Error('usage: photo-import <from> <to>')

photoImport(from, to, function (err, results) {
  if (err) throw err
  console.log('Done')
})
