const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true, 
  // Remove this is you want to run the app on a dedicated server
  // https://stackoverflow.com/questions/50809987/vue-cli-build-and-run-index-html-file-without-server
  publicPath: '' 
})
