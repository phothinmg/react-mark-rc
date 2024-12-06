import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  reactCompilerLoader,
  defineReactCompilerLoaderOption,
} from "react-compiler-webpack";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ReactCompilerConfig = {
  target: 19,
};

/** @type {import('webpack').Configuration} */

const webpackConfig = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "./dist"),
    },
    port: 5454,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.[mc]?[jt]sx$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
              plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
            },
          },
          {
            loader: "ts-loader",
          },
          {
            loader: reactCompilerLoader,
            options: defineReactCompilerLoaderOption({
              // React Compiler options goes here
            }),
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css", ".md"],
  },
};

export default webpackConfig;
