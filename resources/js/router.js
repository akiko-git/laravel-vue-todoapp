import Vue from 'vue'
import Router from 'vue-router'

import TaskComponent from './components/TaskComponent.vue';
// import NotFoundComponent from './components/NotFoundComponent.vue';

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'task',
            component: TaskComponent,
            meta: { title: 'タスク一覧' },
        },
        // {
        //     path: '*',
        //     component: NotFoundComponent,
        // }
    ],
})

router.afterEach((to, from) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title
    }
})

export default router;