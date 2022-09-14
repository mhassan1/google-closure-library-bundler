const { bundle } = require('..')
const { join } = require('path')
const { readFileSync } = require('fs')

const normalizeLineEndings = str => str.replace(/\r?\n/g, '\n');

describe('bundle', () => {
  it('creates a bundle', async () => {
    await bundle('./test/fixtures/index.js', {
      path: join(__dirname, 'fixtures'),
      filename: 'output.js',
      hashFunction: 'md5'
    })
    expect(readFileSync('./test/fixtures/output.js', 'utf8')).toEqual(normalizeLineEndings(readFileSync('./test/fixtures/expected.js', 'utf8')))
    expect(() => require('./fixtures/output').string.Const.from('hello')).not.toThrow()
  }, 15000)

  it('fails to create a bundle with invalid inputs', async () => {
    expect(bundle('./test/fixtures/i-do-not-exist.js', {
      path: join(__dirname, 'fixtures'),
      filename: 'output.js',
      hashFunction: 'md5'
    })).rejects.toThrow()
  })
})
