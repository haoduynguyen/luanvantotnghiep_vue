import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/User/List'
import AddUser from '@/components/User/AddUser'
import EditUser from '@/components/User/edit'
import ChangePassword from '@/components/User/changePassword'
import LichDay from '@/components/lichday/index'
import LichDayGV from '@/components/lichday/indexFromGV'
import MuonPhong from '@/components/lichday/indexMuonPhong'
import importLichDay from '@/components/lichday/import'
import ListMoTaGV from '@/components/PhongMay/ListMayLoi'
import Login from '@/components/Auth/Login'
import ForgotPassword from '@/components/Auth/forgotPassword'
import SendEmail from '@/components/Auth/sendEmail'
import EmailNotification from '@/components/Auth/emailNotification'
import Layout from '@/Layout'
import App from '@/App'
import auth from '@/middleware/auth'
import updatePM from '@/components/PhongMay/updatePM'

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
            path: '/forgot-password/:token', component: Layout, name: 'Layout', children: [
                {
                    path: '/forgot-password',
                    name: 'ForgotPassword',
                    component: ForgotPassword
                },
            ]
        },

        {
            path: '/send-email', component: Layout, name: 'Layout', children: [
                {
                    path: '/send-email',
                    name: 'SendEmail',
                    component: SendEmail
                },
            ]
        },

        {
            path: '/email-notification', component: Layout, name: 'Layout', children: [
                {
                    path: '/email-notification',
                    name: 'EmailNotification',
                    component: EmailNotification
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
                    path: '/change-password/:id',
                    name: 'ChangePassword',
                    component: ChangePassword,
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
                    path: '/list-mo-ta-gv',
                    name: 'ListMoTaGV',
                    component: ListMoTaGV,
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

                {
                    path: '/update-PM/:id',
                    props: true,
                    name: 'updatePM',
                    component: updatePM,
                    meta: {
                        middleware: auth,
                    },
                },
            ]
        },
    ],

    mode: 'history',
})
