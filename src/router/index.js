import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/User/List'
import AddUser from '@/components/User/AddUser'
import EditUser from '@/components/User/edit'
import LichDay from '@/components/lichday/index'
import LichDayGV from '@/components/lichday/indexFromGV'
import MuonPhong from '@/components/lichday/indexMuonPhong'
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
                    path: '/',
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
                    path: '/edit-user/:id',
                    name: 'EditUser',
                    component: EditUser,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/lich-day',
                    name: 'LichDay',
                    component: LichDay,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/lich-day-gv',
                    name: 'LichDayGV',
                    component: LichDayGV,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/dk-muon-phong',
                    name: 'MuonPhong',
                    component: MuonPhong,
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
