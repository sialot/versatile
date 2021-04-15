const path = require('path');

// 基础的webpack配置
module.exports = {
  module: {
    rules: [   
         
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.ts','.vue','.styl'],
    alias: {
      '~native': path.resolve(__dirname, 'native'), // 别名，方便import
      '~resources': path.resolve(__dirname, 'resources'), // 别名，方便import      
      '@': path.resolve(__dirname, 'src/renderer/')
    }
  },
  devtool: 'source-map',
  plugins: []
};