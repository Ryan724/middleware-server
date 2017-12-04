// Provide custom regenerator runtime and core-js
require('./polyfill-hook');

const app = require('./app.js');
const convert = require('koa-convert');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const devMiddleware = require('koa-webpack-dev-middleware');
const hotMiddleware = require('koa-webpack-hot-middleware');
const views = require('koa-views');
const router = require('./routes');
const clientRoute = require('./middlewares/clientRoute');
const config = require('../build/app/webpack.dev.config');

const port = process.env.port || 3000;
const compiler = webpack(config);


// Webpack hook event to write html file into `/views/dev` from `/views/tpl` due to server render
compiler.plugin('emit', (compilation, callback) => {
    const assets = compilation.assets
    let file, data

    Object.keys(assets).forEach(key => {
        if (key.match(/\.html$/)) {
            file = path.resolve(__dirname, key)
            data = assets[key].source()
            fs.writeFileSync(file, data)
        }
    })
    callback()
})

app.use(views(path.resolve(__dirname, '../views/'), {map: {html: 'ejs'}}))
app.use(clientRoute)
app.use(router.routes())
app.use(router.allowedMethods())

console.log(`\n==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.\n`)


app.use(convert(devMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
})))
app.use(convert(hotMiddleware(compiler)))
app.listen(port)
