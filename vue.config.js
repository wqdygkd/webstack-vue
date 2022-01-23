module.exports = {
  lintOnSave: false,
  //webpack自定义配置，配置获取本地数据接口，使用proxy解决数据接口的跨域问题
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
        config.mode = 'production'
    } else {
        config.mode = 'development'
        import('./src/db/server.mjs')
        config.devServer = {
            proxy:{//使用proxy解决跨域问题
                '/api': {// 以 “/api” 开头的 代理到 下边的 target 属性 的值 中
                    target: 'http://localhost:8081',
                    changeOrigin: true,
                    pathRewrite: {// 路径重写
                        '^/api': '/' // 这个意思就是以api开头的，定向到哪里, 如果你的后边还有路径的话， 会自动拼接上
                    }
                }
            }
        }
    }
}
}
