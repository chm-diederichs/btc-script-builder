const int = require('bitcoin-consensus-encoding').int
const assert = require('nanoassert')
const OPS = require('./opcodes.json')

module.exports = Script

function Script () {
  this.stack = []
}

Script.prototype.addOp = function (op) {
  if (typeof op === 'number') op = op.toString(10)

  // to normalise prefixed entries
  if (op.substring(0, 3) === 'OP_') {
    op = op.substring(3)
  }

  // replace OP strings with hex code
  if (OPS.hasOwnProperty('OP_' + op)) {
    op = 'OP_' + op
    this.stack.push(OPS[op])
  } else {
    return new Error('opcode not recognised.')
  }

  return this
}

Script.prototype.addData = function (data, addPushCode = true) {
  if (typeof data === 'string') {
    data = Buffer.from(data, 'hex')
  }

  assert(data instanceof Uint8Array, 'data should be passed as a Buffer, Uint8Array or hex encoded string.')

  const [prefix, length] = prefixLength(data)

  if (prefix && addPushCode) this.stack.push(prefix)
  this.stack.push(length)
  this.stack.push(data)

  return this
}

Script.prototype.from = function (scriptString) {
  var input = scriptString.split(' ')

  for (let item of input) {
    if (item )
    if (item.substring(0, 3) === 'OP_') {
      this.addOp(item)
    } else {
      this.addData(item, false)
    }
  }

  return this
}
  
Script.prototype.compile = function (buf, offset) {
  if (!buf) buf = Buffer.alloc(this.encodingLength())
  if (!offset) offset = 0

  for (let item of this.stack) {
    if (item instanceof Uint8Array) {
      buf.set(item, offset)
      offset += item.byteLength
    } else {
      buf.writeUInt8(item, offset)
      offset++
    }
  }

  return buf
}

Script.prototype.removeItems = function (n) {
  for (let i = 0; i < n; i++) {
    this.stack.pop(item)
  }

  return this
} 

Script.prototype.clearStack = function () {
  this.stack = []

  return this
}

Script.prototype.encodingLength = function () {
  let length = 0

  for (let item of this.stack) {
    if (item instanceof Uint8Array) {
      length += item.byteLength
    } else {
      length++
    }
  }

  return length
}

// encode length of subsequent raw data on stack
function prefixLength (data) {
  var length = int.encode(data.byteLength)

  var prefix
  switch (int.encode.bytes) {
    // if data.byteLength < 76 length is encoded directly
    // otherwise the next byte is encodes data.byteLength
    case (1) :
      if (data.byteLength < 76) {
        return [null, length]
      } else {
        prefix = OPS['OP_PUSHDATA1']
      }
      break

    // next 2 bytes encode length of data
    case (2) :
      prefix = OPS['OP_PUSHDATA2']
      break

    // next 4 bytes encode length of data
    case (4) :
      prefix = OPS['OP_PUSHDATA4']
      break
  }
  
  return [prefix, length]
}
