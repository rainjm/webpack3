module.exports = (env) => {
    const config =  env ? require(`./webpack.${env}.js`) : require(`./webpack.dev.js`);
    return config;
}
