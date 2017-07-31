const autoprefixer = require('autoprefixer');
const precss = require('precss');
const postcssCalc = require('postcss-calc');
// const postcssModules = require('postcss-modules');

module.exports = {
    plugins: [
        autoprefixer,
        precss,
        postcssCalc,
        // postcssModules({generateScopedName: '[name]__[local]___[hash:base64:5]'})
    ]
};
