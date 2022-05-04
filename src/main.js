import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import KeyboardEvents from './components/KeyboardEvents'

loadFonts()

createApp(App)
  .component('keyboard-events', KeyboardEvents)
  .use(vuetify)
  .mount('#app')
