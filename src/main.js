import { createApp } from 'vue'
import App from './App.vue'
import KeyboardEvents from './components/KeyboardEvents'

const app = createApp(App)
app.component('keyboard-events', KeyboardEvents)
app.mount('#app')
