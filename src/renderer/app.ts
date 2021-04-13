import Vue from 'vue';
import router from './router';
import App from './app.vue';

import './assets/app.scss';

const isProd = process.env.NODE_ENV === 'production';
Vue.config.productionTip = isProd;

new Vue({
    router,
    render: (h) => h(App)
}).$mount('#app');