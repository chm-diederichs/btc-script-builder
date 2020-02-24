const test = require('tape')
const Script = require('./')
const vectors = require('./vectors/scripts.json')
const opcodes = require('./vectors/ops.json')

test('script encode', function (t) {
  var script = new Script()
  t.throws(() => script.compile())
  t.throws(() => script.compile(false))
  t.assert(script.encodingLength() === 0)
  t.throws(() => script.from(''))

  t.end()
})

test('script addOp', function (t) {
  var script = new Script()

  for (let opcode of opcodes) {
    for (let input of opcode.ops) {
      script.addOp(input)
      t.equal(script.stack.pop(), opcode.expected, `${input}`)
    }
  }

  t.throws(() => script.addOp('foo'))
  t.throws(() => script.addOp(20))
  t.throws(() => script.addOp(-1))

  t.end()
})

test('script addOp', function (t) {
  var script = new Script()

  script.addData('deadbeef')
  var data = script.stack.pop()
  var length = script.stack.pop()
  t.same(data, Buffer.from('deadbeef', 'hex'))
  t.same(length, Buffer.from('04', 'hex'))

  script.addData(Buffer.from('deadbeef', 'hex'))
  console.log(script.stack)
  var data = script.stack.pop()
  var length = script.stack.pop()
  t.same(data, Buffer.from('deadbeef', 'hex'))
  t.same(length, Buffer.from('04', 'hex'))

  t.throws(() => script.addOp(''))
  t.throws(() => script.addOp(20))
  t.throws(() => script.addOp(-1))

  t.end()
})


test('script encoding', function (t) {
  var script = new Script()

  for (let vector of vectors) {
    const result = script.from(vector.script).compile() 
    const reference = Buffer.from(vector.bytes, 'hex')

    t.same(result, reference, `vector ${vector.id}`)
    script.clearStack()
  }

  t.end()
})
