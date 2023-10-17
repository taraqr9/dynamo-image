import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import Toaster from "@meforma/vue-toaster";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toaster)
app.use(VueAxios, axios)

app.mount('#app')
