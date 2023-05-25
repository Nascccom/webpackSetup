const path = require("path");

const mode = process.env.NODE_ENV || 'development';
// devMode - проверяем, является ли mode - разработкой
const devMode = mode === 'development'

// определяем для каких браузеров проводим сборку, обновляются необх автопрефиксы
const target = devMode ? 'web' : 'browserslist';

// если у нас режим разработки тогда добавим source-map, что бы удобно было находить ошибки
// если у нас продакшн - тогда undefined
const devtool = devMode ? 'source-map' : undefined

// Переменная после установки плагина HtmlWebpackPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Переменная после установки плагина MiniCssExtractPlugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true
  },
  entry: ["@babel/polyfill", path.resolve(__dirname, 'src', 'index.js')],
  module: { //Когда установили loader-html, добавили modules/rules и сам test, loader и import "./index.html" в index.js;
    rules: [
      {test: /\.html$/i, loader: "html-loader"},
      {
        test: /\.(c|sa|sc)ss$/i,  // устанавливаем универс расширение файлов стилей (сейчас будут обраб и css, и sass, и scss)
        use: [  //если режим разработкиВКЛ - "style-loader", или внутри плагина берем встроенный MiniCssExtractPlugin.loader
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader", //лоадер для считывания css файлов
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')]
              }
            }
          },
          "sass-loader", //лоадер для считывания scss/sass файлов
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]',
        }
      },
      {
        test: /\.(jpe?g|png|gif|webp|svg)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ],
        type: 'asset/resource',
        generator: {
          filename: 'image/[name][ext]',
        }
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {targets: "defaults"}]]
          }
        }
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'index_bundle.[contenthash].js',
    assetModuleFilename: "assets/[name][ext]"
  },
  plugins: [
    new HtmlWebpackPlugin({  // добавили плагин после установки в config
      template: path.resolve(__dirname, 'src', 'index.html') //прописываем путь к файлу index.html
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css' //пишем для генерации имени файла
    })
  ],
}