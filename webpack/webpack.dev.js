/* eslint-disable import/no-extraneous-dependencies */
const NodemonPlugin = require('nodemon-webpack-plugin');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '../env/.env.dev') });
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    entry: ['webpack/hot/poll?1000', path.join(__dirname, '../src/server.ts')],
    externals: [
        nodeExternals({
            allowlist: ['webpack/hot/poll?1000'],
        }),
    ],
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed),
        }),
        new NodemonPlugin({
            watch: path.join(__dirname, '../src'),
            verbose: true,
            ext: 'ts,js',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    watch: true,
});
