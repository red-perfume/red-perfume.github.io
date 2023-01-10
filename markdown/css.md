## `red-perfume-css`

Library for atomizing strings of CSS. It is completely synchronous.


### Red-Perfume-CSS Usage

1. `npm install --save-dev red-perfume-css`

```js
const redPerfumeCss = require('red-perfume-css');

const results = redPerfumeCss({
  uglify: false,
  input: '.dog { padding: 8px }'
});

console.log(results);
// Results would looks somewhat like this. (subject to change before v1.0.0)
{
  atomizedCss: `
  .rp__padding__--COLON8px {
    padding: 8px;
  }
  `,
  classMap: {
    '.dog': ['rp__padding__--COLON8px']
  },
  styleErrors: []
}
```


### CSS API Documentation

Key            | Type     | Default         | Description
:--            | :--      | :--             | :--
`verbose`      | Boolean  | `true`          | If true, consoles out helpful warnings and errors using `customLogger` or `console.error`.
`customLogger` | Function | `console.error` | **Advanced** - You can pass in your own custom function to log errors/warnings to. When called the function will receive a `message` string for the first argument and sometimes an `error` object for the second argument. This can be useful in scenarios like adding in custom wrappers or colors in a command line/terminal. This function may be called multiple times before all tasks complete. Only called if `verbose` is true. If not provided and `verbose` is true, normal `console.error` messages are called.
`uglify`       | Boolean  | `false`         | If `false` the atomized classes, and all references to them, are long (`.rp__padding__--COLOR12px`). If `true` they are short (`.rp__b5p`).
`input`        | String   | `''`            | A string of any valid CSS to be atomized
    
**Returns:** an object containing these keys

Keys                 | Type   | Description
:--                  | :--    | :--
`atomizedCss`        | string | The `input` string after it is atomized.
`classMap`           | object | An object where the keys are the original class names and the values are the atomized class names made from the original CSS rule. This is the same map we output in the `scripts.out`. **IMPORTANT:** How the keys are written (with or without a `.`) and how the values are stored (as an array or string) are subject to change before v1.0.0.
`styleErrors`        | array  | An array of errors from attempting to read/write/parse/stringify style files.
