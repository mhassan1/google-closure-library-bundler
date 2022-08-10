const webpack = require('webpack')
const { GoogleClosureLibraryWebpackPlugin } = require('google-closure-library-webpack-plugin/dist/Plugin')

module.exports.bundle = async (entry, output) => {
  const compiler = webpack({
    entry,
    output: {
      ...output,
      library: {
        type: 'commonjs2',
        ...output.library
      }
    },
    mode: 'production',
    devtool: false,
    target: ['web', 'es5'],
    optimization: {
      minimize: true,
      concatenateModules: false
    },
    plugins: [
      new GoogleClosureLibraryWebpackPlugin({
        base: require.resolve('google-closure-library/closure/goog/base'),
        sources: [entry],
        target: 'commonjs'
      }),
      {
        apply: (compiler) => {
          const pluginDescriptor = { name: 'export-plugin', stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE }
          compiler.hooks.compilation.tap(pluginDescriptor, (compilation) => {
            compilation.hooks.optimizeAssets.tapPromise(pluginDescriptor, async (assets) => {
              for (const [assetName, asset] of Object.entries(assets)) {
                let source = asset.source()

                if (assetName.endsWith('LICENSE.txt')) continue

                const googExportReplacement = 'var goog = __webpack_require__'
                const googExportIndex = source.lastIndexOf(googExportReplacement)

                source = source.slice(0, googExportIndex) +
                  'var goog = __webpack_exports__ = __webpack_require__' +
                  source.slice(googExportIndex + googExportReplacement.length)

                assets[assetName] = new compiler.webpack.sources.RawSource(source)
              }
            })
          })
        }
      }
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
