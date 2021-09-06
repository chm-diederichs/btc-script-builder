# btc-script-builder

Little module for directlty composing bitcoin scripts and compiling to byte code.

## Install

```sh
npm i btc-script-builder
```

## Usage

```js
var Script = require('btc-script-builder')

var myScript = new Script()

// lets make a 2-of-2 multisig script
const scriptBuf = myScript.addOp('OP_2')
  .addData('0252a536c77bb9a0e46abb21633f2382a3c68de9b48c7933142d70d759cddb35c2')
  .addData(Buffer.from('03e5f2f74b8277f7b69d80987bff932de1009d82f366a920bfa60359620e5f5858', 'hex')
  .addOp('OP_PUSHNUM_2')
  .addOp('CHECKMULTISIG')
  .compile()

console.log('myScript is ', scriptBuf)
// myScript is <Buffer 52 21 02 52 a5 36 c7... 58 58 52 ae>
```

## API

#### `script = new Script()`

Instantiate a new script builder.

#### `script.addOp(op)`

Push an opcode to the stack. `op` should be passed as a string and *does not* have to be prefixed with 'OP_'. For `OP_<n>`, with `2 <= n <= 16`, `n` may be passed as a decimal number, string or as the string `PUSHNUM_<n>`.

#### `script.addOps(...ops)`

Push an array of opcodes to the stack.

#### `script.addData(data)`

Push some data onto the stack. `data` may be passed as a hex-encoded string or directly as a `buffer` or `Uint8Array`.

#### `script.addByte(byte)`

Push a single byte to the stack.

#### `script.addNumber(number)`

Push a number to the stack in a Bitcoin compliant manner.

#### `script.from(scriptString)`

In many cases, we may wish to simply encode some assembly directly. In this caase, the assembly script may be passed as a `string` and it shall be parsed into a stack.

#### `var buf = script.compile([buf, offset])`

Compile the current stack into bytecode in `buf` starting at `offset`. Shall return a new `buffer` if none is provided.

#### `script.removeItems(n)` 

Remove `n` items from the top of the stack. Returns the `script` object.

#### `script.clearStack()`

Empty the current stack.

#### `var len = script.encodingLength()`

Returns the length of the bytecode corresponding to the current stack.

## License

[ISC](LICENSE)
