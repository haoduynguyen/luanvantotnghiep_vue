// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import Layout from './Layout'

window.VueAxios = require('vue-axios').default;
window.Axios = require('axios').default;

Vue.config.productionTip = false
Vue.prototype.$http = Axios.bind(window);
/* eslint-disable no-new */
Vue.use(Vuetify, Axios, VueAxios);
function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
        // Run the default Vue Router `next()` callback first.
        context.next(...parameters);
        // Than run the subsequent Middleware with a new
        // `nextMiddleware()` callback.
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({...context, next: nextMiddleware});
    };
}

router.beforeEach(async (to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];

        const context = {
            from,
            next,
            router,
            to,
        };
        const nextMiddleware = nextFactory(context, middleware, 1);

        middleware[0]({...context, next: nextMiddleware});
    }

    /* */

    next()
});
window.app = new Vue({
    el: '#app',
    router,
    components: {Layout},
    template: '<Layout/>',
    created() {
        if (typeof gapi !== undefined) {
            const _gapi = gapi ? gapi : window.gapi
            _gapi.load('auth2', function () {
                _gapi.auth2.init({client_id: '931597282160-1eg67i8jc4v916ajq2n8v88om23t9r3u.apps.googleusercontent.com'})
                console.log('Auth2 ready in main', gapi)
            });
        }
    },
    methods: {
    }
})
