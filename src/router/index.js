import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/User/List'
import AddUser from '@/components/User/AddUser'
import LichDay from '@/components/lichday/index'
import importLichDay from '@/components/lichday/import'
import Login from '@/components/Auth/Login'
import Layout from '@/Layout'
import App from '@/App'
import auth from '@/middleware/auth'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/', component: Layout, name: 'Layout', children: [
                {
                    path: 'login',
                    name: 'Login',
                    component: Login
                },
            ]
        },
        {
            path: '/', component: App, name: 'App', meta: {
                middleware: auth,
            }, children: [

                {
                    path: '/list',
                    name: 'ListUser',
                    component: List,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/add-user',
                    name: 'AddUser',
                    component: AddUser,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/lichday',
                    name: 'LichDay',
                    component: LichDay,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/add-lichday',
                    name: 'importLichDay',
                    component: importLichDay,
                    meta: {
                        middleware: auth,
                    },
                },
            ]
        },
    ],

    mode: 'history',
})
