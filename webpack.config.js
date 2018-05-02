var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
  context: sourcePath,
  entry: {
    app: './index.tsx'
  },
  output: {
    path: outPath,
    filename: 'bundle.js',
    chunkFilename: '[chunkhash].js',
    publicPath: !isProduction ? '/' : './'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      app: path.resolve(__dirname, 'src/app/'),
      'three/bokehpass': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/BokehPass.js'),
      'three/effectcomposer': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/EffectComposer.js'),
      'three/renderpass': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/RenderPass.js'),
      'three/shaderpass': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/ShaderPass.js'),
      'three/bokehshader': path.join(__dirname, 'node_modules/three/examples/js/shaders/BokehShader.js'),
      'three/copyshader': path.join(__dirname, 'node_modules/three/examples/js/shaders/CopyShader.js'),
      'three/ssaoshader': path.join(__dirname, 'node_modules/three/examples/js/shaders/SSAOShader.js'),
      'three/fxaashader': path.join(__dirname, 'node_modules/three/examples/js/shaders/FXAAShader.js'),
      'three/maskpass': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/MaskPass.js'),
      'three/smaapass': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/SMAAPass.js'),
      'three/smaashader': path.join(__dirname, 'node_modules/three/examples/js/shaders/SMAAShader.js'),
      'three/gui': path.join(__dirname, 'node_modules/three/examples/js/libs/dat.gui.min.js'),
      'three/stats': path.join(__dirname, 'node_modules/three/examples/js/libs/stats.min.js'),
      'three/crossfadeScene': path.join(__dirname, 'node_modules/three/examples/js/crossfade/scenes.js'),
      'three/crossfadeTransition': path.join(__dirname, 'node_modules/three/examples/js/crossfade/transition.js'),
      'three/trackballcontrols': path.join(__dirname, 'node_modules/three/examples/js/controls/TrackballControls.tsx'),
      'three/flycontrols': path.join(__dirname, 'node_modules/three/examples/js/controls/FlyControls.js'),
      'three/firstpersoncontrols': path.join(__dirname, 'node_modules/three/examples/js/controls/FirstPersonControls.js'),
      'three/line2': path.join(__dirname, 'node_modules/three/examples/js/lines/Line2.js'),
      'three/linegeometry': path.join(__dirname, 'node_modules/three/examples/js/lines/LineGeometry.js'),
      'three/linematerial': path.join(__dirname, 'node_modules/three/examples/js/lines/LineMaterial.js'),
      'three/linesegments2': path.join(__dirname, 'node_modules/three/examples/js/lines/LineSegments2.js'),
      'three/linesegmentsgeometry': path.join(__dirname, 'node_modules/three/examples/js/lines/LineSegmentsGeometry.js'),
    }
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: isProduction
          ? 'ts-loader'
          : ['babel-loader?plugins=react-hot-loader/babel', 'ts-loader']
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
                  require('postcss-import')({ addDependencyTo: webpack }),
                  require('postcss-url')(),
                  require('postcss-cssnext')(),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({
                    disabled: isProduction
                  })
                ]
              }
            }
          ]
        })
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.(svg)$/, use: 'url-loader?limit=10000' },
      { test: /\.(jpg|gif|png|mp3|wav)$/, use: 'file-loader' },
      {
        test: /\.json$/,
        loader: 'url-loader',
        type: "javascript/auto"
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false
    }),
    new WebpackCleanupPlugin(),
    new ExtractTextPlugin({
      filename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
      template: 'assets/index.html'
    }),
    new webpack.ProvidePlugin({
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
