import Vue from 'vue';
import VueRouter from 'vue-router';
import mainView from '../view/main-view.vue'
Vue.use(VueRouter);
export default new VueRouter({
    routes: [
        {
            path:'/',
            redirect:'/main-view'
        },
        {
            path:'/main-view',
            component:mainView
        }
    ]
});
 