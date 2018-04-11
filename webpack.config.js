const Webpack = require('webpack');
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.argv.indexOf('-p') >= 0;
const outPath = Path.join(__dirname, './dist');
const sourcePath = Path.join(__dirname, './src');
const publicPath = Path.join(__dirname, './public');

module.exports = {
  context: sourcePath,
  entry: {
    main: './index.tsx',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux'
    ]
  },
  output: {
    path: outPath,
    filename: 'bundle.js',
    chunkFilename: '[chunkhash].js',
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    mainFields: ['module', 'browser', 'main'],
    alias: {
      'three/bokehpass': Path.join(__dirname, 'node_modules/three/examples/js/postprocessing/BokehPass.js'),
      'three/effectcomposer': Path.join(__dirname, 'node_modules/three/examples/js/postprocessing/EffectComposer.js'),
      'three/renderpass': Path.join(__dirname, 'node_modules/three/examples/js/postprocessing/RenderPass.js'),
      'three/shaderpass': Path.join(__dirname, 'node_modules/three/examples/js/postprocessing/ShaderPass.js'),
      'three/bokehshader': Path.join(__dirname, 'node_modules/three/examples/js/shaders/BokehShader.js'),
      'three/copyshader': Path.join(__dirname, 'node_modules/three/examples/js/shaders/CopyShader.js'),
      'three/ssaoshader': Path.join(__dirname, 'node_modules/three/examples/js/shaders/SSAOShader.js'),
      'three/fxaashader': Path.join(__dirname, 'node_modules/three/examples/js/shaders/FXAAShader.js'),
      'three/maskpass': Path.join(__dirname, 'node_modules/three/examples/js/postprocessing/MaskPass.js'),
      'three/smaapass': Path.join(__dirname, 'node_modules/three/examples/js/postprocessing/SMAAPass.js'),
      'three/smaashader': Path.join(__dirname, 'node_modules/three/examples/js/shaders/SMAAShader.js'),
      'three/gui': Path.join(__dirname, 'node_modules/three/examples/js/libs/dat.gui.min.js'),
      'three/stats': Path.join(__dirname, 'node_modules/three/examples/js/libs/stats.min.js'),
      'three/crossfadeScene': Path.join(__dirname, 'node_modules/three/examples/js/crossfade/scenes.js'),
      'three/crossfadeTransition': Path.join(__dirname, 'node_modules/three/examples/js/crossfade/transition.js'),
      'three/trackballcontrols': Path.join(__dirname, 'node_modules/three/examples/js/controls/TrackballControls.tsx'),
      'three/flycontrols': Path.join(__dirname, 'node_modules/three/examples/js/controls/FlyControls.js'),
      'three/firstpersoncontrols': Path.join(__dirname, 'node_modules/three/examples/js/controls/FirstPersonControls.js'),
      'three/geometryutils': Path.join(__dirname, 'node_modules/three/examples/js/utils/GeometryUtils.js'),
    },
  },
  module: {
    loaders: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: isProduction
          ? 'awesome-typescript-loader?module=es6'
          : [
            'react-hot-loader/webpack',
            'awesome-typescript-loader'
          ]
      },
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-import')({ addDependencyTo: Webpack }),
                  require('postcss-url')(),
                  require('postcss-cssnext')(),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({ disabled: isProduction }),
                ]
              }
            }
          ]
        })
      },
      // svg
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: false // true outputs JSX tags
            }
          }
        ]
      },
      {
        test: /three\/examples\/js/,
        use: 'imports-loader?THREE=three'
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.png$/, use: 'file-loader' },
      { test: /\.jpg$/, use: 'file-loader' },
      { test: /\.mp3$/, use: 'file-loader' },
      { test: /\.wav$/, use: 'file-loader' },
    ]
  },

  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': isProduction === true ? JSON.stringify('production') : JSON.stringify('development'),
      'process.env.PUBLIC_URL': JSON.stringify(sourcePath + publicPath)
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new Webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !isProduction
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new Webpack.ProvidePlugin({
      THREE: 'three'
    })
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal'
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
