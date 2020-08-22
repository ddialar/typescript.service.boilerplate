/* eslint-disable import/no-extraneous-dependencies */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '../env/.env.dev') });
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'none',
    entry: [path.join(__dirname, '../src/server.ts')],
    node: {
        __dirname: false,
        __filename: false,
    },
    optimization: {
        usedExports: true,
    },
    externals: [nodeExternals({})],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed),
        }),
        new CleanWebpackPlugin(),
    ],
});
