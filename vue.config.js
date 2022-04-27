const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true, 
  // Raw loader config
  // https://stackoverflow.com/questions/54697757/read-file-inside-current-directory-using-vue
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.txt$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  },
  // Remove this is you want to run the app on a dedicated server
  // https://stackoverflow.com/questions/50809987/vue-cli-build-and-run-index-html-file-without-server
  publicPath: '' 
})
