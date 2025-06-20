import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Configuration } from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
  mode: isDev ? 'development' : 'production',
  entry: {
    // popup: './src/pages/Popup.tsx',
    options: {
      import: './src/pages/Options.tsx',
      filename: 'options.js',
    },
    'service-worker': './src/pages/ServiceWorker.ts',
    offscreen: './src/pages/Offscreen.ts',
  },
  output: {
    publicPath: '',
    path: path.resolve(__dirname, isDev ? 'dist/dev' : 'dist/prod'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js'),
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'globals.css',
    }),
    // new HtmlWebpackPlugin({
    //   template: './public/popup.html',
    //   filename: 'popup.html',
    //   chunks: ['popup'],
    // }),
    new HtmlWebpackPlugin({
      template: './public/options.html',
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: './public/offscreen.html',
      filename: 'offscreen.html',
      chunks: ['offscreen'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/*.sketch', '**/*.html'],
          },
        },
        { from: 'manifest.json', to: '.' },
      ],
    }),
  ],
  // devtool: isDev ? 'inline-source-map' : false,
  devtool: isDev ? 'source-map' : false,
  optimization: {
    minimize: !isDev,
  },
};

export default config;
