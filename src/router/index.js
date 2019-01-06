import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/User/List'
import AddUser from '@/components/User/AddUser'
import EditUser from '@/components/User/edit'
import ChangePassword from '@/components/User/changePassword'
import LichDay from '@/components/lichday/index'
import LichDayGV from '@/components/lichday/indexFromGV'
//import MuonPhong from '@/components/lichday/indexMuonPhong'
import TestMuonPhong from '@/components/lichday/testIndexMuonPhong'
import MuonPhongKtv from '@/components/lichday/IndexPhongKtv'
import importLichDay from '@/components/lichday/import'
import ListMoTaGV from '@/components/PhongMay/listMayLoiGv'
import ListMayLoi from '@/components/PhongMay/listMayLoi'
import updatePM from '@/components/PhongMay/updatePM'
import UpdatePhongMayKtv from '@/components/PhongMay/updatePhongMayKtv'
import Login from '@/components/Auth/Login'
import Fakefb from '@/components/Auth/fakeFb'
import TestLoginFB from '@/components/Auth/testLoginFB'
import ForgotPassword from '@/components/Auth/forgotPassword'
import SendEmail from '@/components/Auth/sendEmail'
import EmailNotification from '@/components/Auth/emailNotification'
import Layout from '@/Layout'
import App from '@/App'
import auth from '@/middleware/auth'
import ListMuonPhong from '@/components/MuonPhong/listMuonPhong'
import ListDangKyNghi from '@/components/DangKyNghi/listDangKyNghi'
import ListMonHoc from '@/components/MonHoc/list'
import AddMonHoc from '@/components/MonHoc/add'
import EditMonHoc from '@/components/MonHoc/edit'
import ListPhongMay from '@/components/PhongMay/listPM'
import ListPhongMayKTV from '@/components/PhongMay/listPM-ktv'
import UpdateDanhSachPM from '@/components/PhongMay/updateDS'
import UpdateDanhSachPMKTV from '@/components/PhongMay/updateDS-ktv'
import ListHocKy from '@/components/HocKy/listHocKy'
import UpdateHocKy from '@/components/HocKy/updateHocKy'
import AddHocKy from '@/components/HocKy/addHocKy'
import AddDanhSachPM from '@/components/PhongMay/addDS'
import permission from '@/components/Auth/permission'

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
                    path: '/forgot-password/:token',
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
            path: '/login-fb', component: Layout, name: 'Layout', children: [
                {
                    path: '/login-fb',
                    name: 'TestLoginFB',
                    component: TestLoginFB
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
                    menu:'1',
                    text:'Danh Sách User',
                    icon:'user'
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
                    path: '/lich-day-cu',
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
                    menu:'1',
                    text:'Lịch Dạy Giảng Viên',
                    icon:'schedule',
                },
                {
                    path: '/ds-mon-hoc',
                    name: 'ListMonHoc',
                    component: ListMonHoc,
                    meta: {
                        middleware: auth,
                    },
                    menu:'1',
                    text:'Danh Sách Môn Học',
                    icon:'list',
                },
                {
                    path: '/add-mon-hoc',
                    name: 'AddMonHoc',
                    component: AddMonHoc,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/edit-mon-hoc/:id',
                    name: 'EditMonHoc',
                    component: EditMonHoc,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/lich-day',
                    name: 'TestMuonPhong',
                    component: TestMuonPhong,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/ds-lich-day',
                    name: 'MuonPhongKtv',
                    component: MuonPhongKtv,
                    meta: {
                        middleware: auth,
                    },
                    menu:'1',
                    text:'lịch dạy',
                    icon:'event'
                },
                {
                    path: '/list-mo-ta-gv',
                    name: 'ListMoTaGV',
                    component: ListMoTaGV,
                    meta: {
                        middleware: auth,
                    },
                    menu:'1',
                    text:'Danh Sách Mô Tả PM',
                    icon:'computer',
                },
                {
                    path: '/list-mo-ta',
                    name: 'ListMayLoi',
                    component: ListMayLoi,
                    meta: {
                        middleware: auth,
                    },
                    menu:'1',
                    text:'Danh Sách Mô Tả PM',
                    icon:'computer'
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
                {
                    path: '/update-PM-Ktv/:id',
                    props: true,
                    name: 'UpdatePhongMayKtv',
                    component: UpdatePhongMayKtv,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/list-muon-phong',
                    props: true,
                    name: 'ListMuonPhong',
                    component: ListMuonPhong,
                    meta: {
                        middleware: auth,
                    },
                    menu:'1',
                    text:'Danh Sách Mượn phòng',
                    icon:'list'
                },
                {
                    path: '/list-dang-ky-nghi',
                    props: true,
                    name: 'ListDangKyNghi',
                    component: ListDangKyNghi,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/list-PM',
                    props: true,
                    name: 'ListPhongMay',
                    component: ListPhongMay,
                    meta: {
                        middleware: auth,
                    },
                    menu:'1',
                    text:'Danh Sách Phòng Máy',
                    icon:'computer'
                },
                {
                    path: '/list-PM-ktv',
                    props: true,
                    name: 'ListPhongMayKTV',
                    component: ListPhongMayKTV,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/update-ds/:id',
                    //props: true,
                    name: 'UpdateDanhSachPM',
                    component: UpdateDanhSachPM,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/update-ds-ktv/:id',
                    //props: true,
                    name: 'UpdateDanhSachPMKTV',
                    component: UpdateDanhSachPMKTV,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/list-hk/',
                    //props: true,
                    name: 'ListHocKy',
                    component: ListHocKy,
                    meta: {
                        middleware: auth,
                    },
                    menu:'1',
                    text:'Danh Sách Học Kỳ',
                    icon:'list'
                },
                {
                    path: '/update-hoc-ky/:id',
                    //props: true,
                    name: 'UpDateHocKy',
                    component: UpdateHocKy,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/add-hoc-ky/:id',
                    //props: true,
                    name: 'AddHocKy',
                    component: AddHocKy,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/add-phong-may/',
                    //props: true,
                    name: 'AddDanhSachPM',
                    component: AddDanhSachPM,
                    meta: {
                        middleware: auth,
                    },
                },
                {
                    path: '/permission',
                    //props: true,
                    name: 'permission',
                    component: permission,
                    meta: {
                        middleware: auth,
                    },
                    menu:'1',
                    text:'Danh Sách Quyền',
                    icon:'schedule'
                },
            ]
        },
    ],

    mode: 'history',
})
