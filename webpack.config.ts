import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Configuration } from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
  mode: isDev ? 'development' : 'production',
  entry: {
    popup: './src/pages/popup/index.tsx',
    background: './src/pages/background/index.ts',
    offscreen: './src/pages/offscreen/index.ts',
  },
  output: {
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
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/*.sketch'],
          },
        },
        { from: 'manifest.json', to: '.' },
      ],
    }),
  ],
  // devtool: isDev ? 'source-map' : false,
  devtool: isDev ? 'inline-source-map' : false,
  optimization: {
    minimize: !isDev,
  },
};

export default config;
