import Vue from 'vue'
import Router from 'vue-router'

import TaskComponent from './components/TaskComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import RegistComponent from './components/RegistComponent.vue';
import NotFoundComponent from './components/NotFoundComponent.vue';

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'task',
            component: TaskComponent,
            meta: { title: 'タスク一覧', requiresAuth: true },
        },
        {
            path: '/login',
            name: 'login',
            component: LoginComponent,
            meta: { title: 'ログイン' },
        },
        {
            path: '/regist',
            name: 'regist',
            component: RegistComponent,
            meta: { title: '新規登録' },
        },
        {
            path: '*',
            component: NotFoundComponent,
        }
    ],
})

function loggedIn() {
    return localStorage.getItem("auth");
}

//ナビゲーションガード
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!loggedIn()) {
            next({
                path: '/login',
                // query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

//タイトル設定
router.afterEach((to, from) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title
    }
})

export default router;