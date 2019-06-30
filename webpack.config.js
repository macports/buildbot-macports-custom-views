var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var TsConfigPathsPlugin = require('awesome-typescript-loader')
  .TsConfigPathsPlugin
var BitBarWebpackProgressPlugin = require('bitbar-webpack-progress-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

function isExternal(module) {
  var context = module.context

  if (typeof context !== 'string') {
    return false
  }

  return context.indexOf('node_modules') !== -1
}

module.exports = {
  entry: {
    scripts: './src/main.module.js',
    styles: './src/styles/styles.less'
  },
  output: {
    path: path.resolve(__dirname, './buildbot_macports_custom_views/static'),
    filename: '[name].js'
  },
  plugins: [
    // Separate "vendors" bundle for external libraries?
    // new CommonsChunkPlugin({
    //   name: 'vendors',
    //   minChunks: function(module) {
    //     return isExternal(module)
    //   }
    // }),

    // might want to add something like this for copying assets like images, but to where?
    // new CopyWebpackPlugin([
    //   // Copy over React and any other node modules which are not being bundled by webpack.
    //   //  (we avoid bundling them to enable browser caching and decrease reload times.)
    //   { from: 'assets', to: 'build/static/assets' }
    // ]),
    // new VueLoaderPlugin(),
    new BitBarWebpackProgressPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ],

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json', '.vue'],
    plugins: [new TsConfigPathsPlugin(/* { tsconfig, compiler } */)],
    alias: {
      vue$: 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },

  module: {
    rules: [
      // all files ending with ".vue" are loaded using vue-loader
      { test: /\.vue$/, loader: 'vue-loader' },

      {
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },

      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader' or awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
      // {
      //   test: /\.vue$/,
      //   loader: 'vue-loader'
      // },
      // {
      //   test: /\.js$/,
      //   loader: 'vue-loader'
      // },
      // {
      //   test: /.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      //   //use: "url-loader?limit=100000"
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         outputPath: 'build/static/assets/'
      //       }
      //     }
      //   ]
      // }
    ]
  }

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM'
  // },

  // node: {
  //   fs: 'empty'
  // }
}
