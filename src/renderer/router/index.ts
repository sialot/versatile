import Vue from 'vue';
import VueRouter from 'vue-router';
import Demo from '../components/demo/index.vue';
Vue.use(VueRouter);
export default new VueRouter({
    routes: [
        {
            path: '/demo',
            name: 'Demo',
            component: Demo,
            meta: {
                title: 'Demo'
            }
        }
    ]
});
 