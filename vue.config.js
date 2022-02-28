module.exports = {
  lintOnSave: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.mode = 'production'
    } else {
      config.mode = 'development'
      // import('./src/db/server.mjs')
      require('./src/server/nodemon.js')
      config.devServer = {
        port: 8087,
        disableHostCheck: true,
        proxy: {
          '/api': {
            target: 'http://localhost:8088',
            changeOrigin: true,
            pathRewrite: {
              '^/api': '/'
            }
          }
        }
      }
    }
  }
}
