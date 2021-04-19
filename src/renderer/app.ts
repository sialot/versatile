import './assets/vscode-codicons/codicon.global.css';
import './assets/app.global.scss';
import Vue from 'vue';
import router from './router';
import App from './app.vue';

const isProd = process.env.NODE_ENV === 'production';
Vue.config.productionTip = isProd;


declare module 'vue/types/vue' {
    interface Vue {
        $globalClick: (func:()=>void)=>void
    }
}

// 定义全局点击函数
Vue.prototype.$globalClick = function (callback:()=>void) {
    document.getElementById('main')!.onclick = function () {
        callback();
    };
};
new Vue({
    router,
    render: (h) => h(App)
}).$mount('#app');

