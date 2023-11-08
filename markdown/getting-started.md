# Getting Started

1. Install [Node/npm](https://nodejs.org) (lowest supported version not yet known, presumed to work with 12+)
1. If you do not have a `package.json` in your project run `npm init -y`
1. `npm install --save-dev red-perfume`
1. `npm pkg set scripts.atomize="node ./atomize.js"`
1. Create a file called `atomize.js` and set up Red Perfume in it for your project (example below)
1. Then run `npm run atomize`

```js
const redPerfume = require('red-perfume');

redPerfume.atomize({
  tasks: [
    {
      uglify: true,
      styles: {
        in: [
          './styles/file1.css',
          './styles/file2.css'
        ],
        out: './dist/styles/styles.css'
      },
      markup: [
        {
          in: './index.html',
          out: './dist/index.html'
        },
        {
          in: './contact.html',
          out: './dist/contact.html'
        }
      ],
      scripts: {
        out: './dist/atomic-styles.json'
      }
    }
  ]
});
```

Detailed API below.
