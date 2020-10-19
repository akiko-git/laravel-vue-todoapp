import Vue from 'vue'
import Router from 'vue-router'

import TaskComponent from './components/TaskComponent.vue';


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'task',
            component: TaskComponent,
        },
    ],
})
