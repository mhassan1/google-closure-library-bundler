const { bundle } = require('..')
const { join } = require('path')
const { readFileSync } = require('fs')

describe('bundle', () => {
  it('creates a bundle', async () => {
    await bundle('./test/fixtures/index.js', {
      path: join(__dirname, 'fixtures'),
      filename: 'output.js'
    })
    expect(readFileSync('./test/fixtures/output.js', 'utf8')).toEqual(readFileSync('./test/fixtures/expected.js', 'utf8'))
  })

  it('fails to create a bundle with invalid inputs', async () => {
    expect(bundle('./test/fixtures/i-do-not-exist.js', {
      path: join(__dirname, 'fixtures'),
      filename: 'output.js'
    })).rejects.toThrow()
  })
})
