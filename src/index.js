const webpack = require('webpack')
const ClosurePlugin = require('closure-webpack-plugin')
const LastCallWebpackPlugin = require('last-call-webpack-plugin')

module.exports.bundle = async (entry, output) => {
  const compiler = webpack({
    entry,
    output,
    mode: 'production',
    devtool: false,
    optimization: {
      minimize: true,
      minimizer: [new ClosurePlugin({ mode: 'AGGRESSIVE_BUNDLE' })],
      concatenateModules: false
    },
    plugins: [
      new ClosurePlugin.LibraryPlugin({
        closureLibraryBase: require.resolve('google-closure-library/closure/goog/base'),
        deps: [require.resolve('google-closure-library/closure/goog/deps')]
      }),
      new LastCallWebpackPlugin({
        assetProcessors: [
          {
            regExp:  /.*/,
            processor: async (assetName, asset) => {
              let source = asset.source()

              const exportsIndex = source.lastIndexOf('(function(__wpcc){')
              if (exportsIndex === -1) throw new Error('Could not find place to put `module.exports`')
              source = spliceString(source, exportsIndex, 'module.exports = ')

              const googMatch = source.match(/(.+)=\1\|\|{};\1\.global=this\|\|self;/)
              if (!googMatch) throw new Error('Could not find `goog` instantiation')

              const googVariable = googMatch[1]

              const googReturnIndex = source.lastIndexOf('}).call(this || window, (window.__wpcc = window.__wpcc || {}));')
              if (!googReturnIndex) throw new Error('Could not find place to put `return goog`')

              return spliceString(source, googReturnIndex, `return ${googVariable};`)
            },
            phase: 'emit'
          }
        ],
      })
    ]
  })
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        return reject(err || new Error(stats.toString('errors-only')))
      }
      resolve(stats.toString())
    })
  })
}

const spliceString = (string, start, insert) => string.slice(0, start) + insert + string.slice(start)
