var ref = require('ssb-ref')
var keys = require('../keys')
var ssbKeys = require('ssb-keys')
var publish = require('./scuttlebot').publish

function unbox_value(msg) {
  var plaintext = ssbKeys.unbox(msg.content, keys)
  if(!plaintext) return null
  return {
    previous: msg.previous,
    author: msg.author,
    sequence: msg.sequence,
    timestamp: msg.timestamp,
    hash: msg.hash,
    content: plaintext,
    private: true
  }
}

module.exports.unbox = function (msg) {
  if(msg.value) {
    var value = unbox_value(msg.value)
    if(value) {
      return {
        key: msg.key, value: value, timestamp: msg.timestamp
      }
    }
  } else {
    return unbox_value(msg)
  }
}

module.exports.box = function (content) {
  return ssbKeys.box(content, content.recps.map(function (e) {
    return ref.isFeed(e) ? e : e.link
  }))
}

module.exports.publish = function (content, cb) {
  if(content.recps)
    content = exports.box(content)
  publish(content, function (err, msg) {
    if(err) throw err
    console.log('Published!', msg)
    if(cb) cb(err, msg)
  })
}