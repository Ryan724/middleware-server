// Provide custom regenerator runtime and core-js
require('babel-polyfill')

// Node babel source map support
require('source-map-support').install()

// Javascript require hook
require('babel-register')({
    presets: ['es2015', 'react', 'stage-0'],
    plugins: [
	    		'add-module-exports',
				'transform-decorators-legacy',
	        	'transform-runtime'
        	]
})

// Css require hook
const hook = require('css-modules-require-hook');
hook({
    extensions: ['.scss'],
    preprocessCss: (data, filename) =>
        require('node-sass').renderSync({
            data,
            file: filename
        }).css,
    camelCase: true,
    generateScopedName: '[name]__[local]__[hash:base64:8]'
})
hook({
    extensions: ['.css'],
    camelCase: false,
    // generateScopedName: '[name]'
})
// Image require hook
require('asset-require-hook')({
    name: '/[hash].[ext]',
    extensions: ['jpg', 'png', 'gif', 'webp'],
    limit: 8000
})

