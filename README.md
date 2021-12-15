# Google Closure Library Bundler

Library for generating a Google Closure Library bundle, based on this [demo](https://github.com/webpack-contrib/closure-webpack-plugin/tree/master/demo/mixed-modules).

Read more about the Google Closure Library [here](https://developers.google.com/closure/library).

## Install
`npm install google-closure-library-bundler`

## Usage
1. Create `entry.js`:
```javascript
// for example
goog.require('goog.html.sanitizer.HtmlSanitizer.Builder')
goog.require('goog.html.sanitizer.unsafe')
```
2. Create `build.js`:
```javascript
const { bundle } = require('google-closure-library-bundler')
const { join } = require('path')

bundle('./entry.js', {
  path: join(__dirname, 'dist'),
  filename: 'goog.js',
  hashFunction: 'md5' // required for node 17+
}).then(() => {
  console.log('All bundled up!')
})
```
3. Run `build.js` to create a bundle in `dist/goog.js`
4. Include the bundle in your build:
```javascript
import goog from './dist/goog'

// for example
const htmlSanitizerBuilder = new goog.html.sanitizer.HtmlSanitizer.Builder()
```

## API

`bundle(entry, output) => Promise<string>`
* `entry` - [Webpack Entry Point](https://webpack.js.org/concepts/entry-points/)
* `output` - [Webpack Output](https://webpack.js.org/concepts/output/)
* Returns: [Webpack Stats](https://webpack.js.org/configuration/stats/) (as string)
