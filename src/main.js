// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import Layout from './Layout'
import FBSignInButton from 'vue-facebook-signin-button'
Vue.use(FBSignInButton)
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
window.fbAsyncInit = function() {
    FB.init({
        appId      : '348232345938588',
        xfbml      : true,
        version    : 'v3.2'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
window.app = new Vue({
    el: '#app',
    router,
    components: {Layout},
    template: '<Layout/>',


    created() {
        if (typeof gapi !== undefined) {
            const _gapi = gapi ? gapi : window.gapi
            _gapi.load('auth2', function () {
                _gapi.auth2.init({client_id: '931597282160-2cfo16vmp2cf8krfa3qkttqpf8pnrvk6.apps.googleusercontent.com'})
            });
        }
    },
    methods: {
    }
})
