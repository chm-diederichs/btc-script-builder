const test = require('tape')
const Script = require('./')
const vectors = require('./vectors.json')

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
