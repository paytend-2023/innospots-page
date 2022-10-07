const path = require('path');
const fs = require('fs');
const WebpackBar = require('webpackbar');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ModuleFederation = require('webpack/lib/container/ModuleFederationPlugin')
const {
  when,
  whenDev,
  whenProd,
  whenTest,
  ESLINT_MODES,
  POSTCSS_MODES,
} = require('@craco/craco');

const IS_DEV = process.env.NODE_ENV !== 'production';

const rewireEntries = [
  {
    name: 'shareDashboard',
    entry: path.resolve(__dirname, './src/shareDashboard.entry.ts'),
    outPath: 'shareDashboard.html',
  }
];

const defaultEntryName = 'main';

const appIndexes = ['js', 'tsx', 'ts', 'jsx'].map(ext =>
  path.resolve(__dirname, `src/index.${ext}`),
);

module.exports = {
  babel: {
    plugins: ['babel-plugin-styled-components'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp|woff2?|eot|ttf|otf|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {},
          },
        ],
      },
    ],
  },
  webpack: {
    alias: {},
    plugins: [
      new WebpackBar(),
      new MonacoWebpackPlugin({ languages: [''] }),
      new ModuleFederation({
        // 导入模块
        remotes: {
          // 导入后给模块起个别名：“微应用名称@地址/导出的文件名”
          // coreModule: IS_DEV ? 'coreModule@http://localhost:8000/coreModule.js' : 'coreModule@/coreModule.js',
          // strategyModule: IS_DEV ? 'strategyModule@http://localhost:8000/strategyModule.js' : 'strategyModule@http://1.15.20.45:9800/strategyModule.js'
        },
        // 应用 B 也可以对外提供模块，因此，也可以配置 filename 和 name
        filename: 'visualization.js',
        // 应用名称，当前模块自己的名字
        name: 'visualization',
        shared: {
          "react": {singleton: true},
          "react-dom": {singleton: true},
        }
      }),
      // new BundleAnalyzerPlugin(),
    ],
    configure: (webpackConfig, { env, paths }) => {
      // paths.appPath='public'
      // paths.appBuild = 'dist'; // 配合输出打包修改文件目录
      // webpackConfig中可以解构出你想要的参数比如mode、devtool、entry等等，更多信息请查看webpackConfig.json文件
      /**
       * 修改 output
       */
      webpackConfig.output = {
        ...webpackConfig.output,
        ...{
          filename: whenDev(() => 'static/js/bundle.js', 'static/js/[name].js'),
          chunkFilename: 'static/js/[name].[contenthash:8].js',
        },
        // path: path.resolve(__dirname, 'dist'), // 修改输出文件目录
        publicPath: IS_DEV ? 'http://localhost:8881/' : '/apps/visualization/',
        library: `datart`,
        libraryTarget: 'umd',
        globalObject: 'window'
      };

      // if (!IS_DEV) {
        webpackConfig.externals = {
          'react': 'React',
          'react-dom': 'ReactDOM',
        };
      // }

      /**
       * webpack split chunks
       */
      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,
        ...{
          chunks: 'all',
          name: false,
          cacheGroups: {
            chartGraph: {
              name: 'ChartGraph',
              test: /[\\/]app[\\/]components[\\/]ChartGraph[\\/]/,
              priority: 100,
              enforce: true,
            },
            antdDesign: {
              name: 'antdDesign',
              test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
              priority: 100,
              enforce: true,
            },
            videoReact: {
              name: 'videoReact',
              test: /[\\/]node_modules[\\/](video-react)[\\/]/,
              priority: 100,
              enforce: true,
            },
            reactGridLayout: {
              name: 'reactGridLayout',
              test: /[\\/]node_modules[\\/]react-grid-layout[\\/]/,
              priority: 100,
              enforce: true,
            },
            rc: {
              name: 'rc',
              test: /[\\/]node_modules[\\/](rc-tree|react-color|rc-menu|rc-slider|rc-table|rc-util|rc-picker|rc-select|rc-field-form|rc-motion|@babel|@emotion|react-i18next|redux|react-draggable|lodash-es|dnd-core|rc-virtual-list|rc-tabs|rc-trigger|react-dnd|echarts-wordcloud|tinycolor|rc-pagination|rc-drawer|react-quill|rc-input-number|gl-matrix|react-resizable|redux-undo|rc-cascader|rc-image|rc-upload|resize-obserer-polyfill|d3-color|rc-dialog|rc-textarea|rc-overflow)[\\/]/,
              priority: 100,
              enforce: true,
            },
            echarts: {
              name: 'echarts',
              test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
              priority: 100,
              enforce: true,
            },
            quill: {
              name: 'quill',
              test: /[\\/]node_modules[\\/]quill[\\/]/,
              priority: 100,
              enforce: true,
            },
            lodash: {
              name: 'lodash',
              test: /[\\/]node_modules[\\/](lodash|lodash-es)[\\/]/,
              priority: 100,
              enforce: true,
            },
            reactdnd: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react-beautiful-dnd|react-dnd)[\\/]/,
              priority: 100,
              enforce: true,
            },
            version: {
              name: 'version',
              test: /[\\/]node_modules[\\/](moment|react-dom|core-js|i18next|rc-field-form|buffer|axios|react-redux)[\\/]/,
              priority: 100,
              enforce: true,
            },
          },
        },
      };

      const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.filter(
        plugin => plugin.constructor.name === 'MiniCssExtractPlugin',
      )[0];
      if (instanceOfMiniCssExtractPlugin) {
        instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;
      }

      const defaultEntryHTMLPlugin = webpackConfig.plugins.filter(plugin => {
        return plugin.constructor.name === 'HtmlWebpackPlugin';
      })[0];

      defaultEntryHTMLPlugin.userOptions.chunks = [defaultEntryName];

      // config.entry is not an array in Create React App 4
      if (!Array.isArray(webpackConfig.entry)) {
        webpackConfig.entry = [webpackConfig.entry];
      }

      // If there is only one entry file then it should not be necessary for the rest of the entries
      const necessaryEntry =
        webpackConfig.entry.length === 1
          ? []
          : webpackConfig.entry.filter(file => !appIndexes.includes(file));
      const multipleEntry = {};
      multipleEntry[defaultEntryName] = webpackConfig.entry;

      rewireEntries.forEach(entry => {
        multipleEntry[entry.name] = necessaryEntry.concat(entry.entry);
        // Multiple Entry HTML Plugin
        webpackConfig.plugins.unshift(
          new defaultEntryHTMLPlugin.constructor(
            Object.assign({}, defaultEntryHTMLPlugin.userOptions, {
              filename: entry.outPath,
              // template: entry.template,
              chunks: [entry.name],
            }),
          ),
        );
      });
      webpackConfig.entry = multipleEntry;

      // Multiple Entry Output File
      let names = webpackConfig.output.filename.split('/').reverse();

      if (names[0].indexOf('[name]') === -1) {
        names[0] = '[name].' + names[0];
        webpackConfig.output.filename = names.reverse().join('/');
      }

      // 返回重写后的新配置
      return webpackConfig;
    },
  },
  jest: {
    configure: (jestConfig, { env, paths, resolve, rootDir }) => {
      return Object.assign(jestConfig, {
        setupFiles: ['jest-canvas-mock'],
      });
    },
    modulePaths: ['../'],
  },
  devServer: {
    onBeforeSetupMiddleware: function ({ app }) {
      app.get('/api/v1/plugins/custom/charts', function (req, res) {
        const pluginPath = 'custom-chart-plugins';
        const dir = fs.readdirSync(`./public/${pluginPath}`);
        res.json({
          data: (dir || [])
            .filter(file => path.extname(file) === '.js')
            .map(file => `${pluginPath}/${file}`),
          errCode: 0,
          success: true,
        });
      });
    },
    hot: true,
    proxy: {
      '/innospots/api/': {
        target: 'http://1.15.20.45:9800/',
        changeOrigin: true,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /^\/shareDashboard\/\w/, to: '/shareDashboard.html' }
      ],
    },
  },
};
