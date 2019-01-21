<template>
    <v-content>
        <v-alert v-if="success != ''"
                 v-model="success"
                 type="success"
                 class="alert-effect"
        >
            <label>{{success}}</label>
        </v-alert>
        <v-alert v-if="info != ''"
                 v-model="info"
                 type="error"
                 class="alert-effect"
        >
            <label>{{info}}</label>
        </v-alert>
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Đăng Nhập</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-model="drawer" v-on:submit.prevent="loginUser" method="POST">
                                <v-text-field prepend-icon="person" name="login" label="Email" v-model="Login.email"
                                              type="text"></v-text-field>
                                <v-text-field prepend-icon="lock" name="password" label="Password"
                                              v-model="Login.password" id="password" type="password"></v-text-field>
                                <v-card-actions>
                                    <v-btn class="btn btn-xs btn-primary login-social-google" @click="signInGoogle">
                                        <img :src="image" alt="" class="custom-social">
                                        Sign in with Google
                                    </v-btn>

                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" class=" btn btn-xs btn-primary" color="success">Đăng Nhập</v-btn>
                                </v-card-actions>
                                <v-card-actions>
                                    <fb-signin-button
                                            :params="fbSignInParams"
                                            @success="onSignInSuccess"
                                            @onlogin="checkLoginState"
                                            class="fa fa-facebook login-social"
                                            >
                                        Sign in with Facebook
                                    </fb-signin-button>
                                    <v-spacer></v-spacer>
                                    <a v-bind:href="urlSendMail +'/send-email' "> Quên mật khẩu??? </a>
                                </v-card-actions>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
    import image from "../../assets/google.png";
    import url from '../../middleware/domain';
    export default {
        name: "Login",
        data: () => ({
            drawer: null,
            Login: {
                email: '',
                password: '',
            },
            fbSignInParams: {
                scope: 'email',
                return_scopes: true
            },
            //url: "https://luanvantn.dev.digiprojects.top",
            //url: 'http://localhost:8000',
            urlSendMail: "http://localhost:8080",
            success: '',
            info: '',
            image:image,
        }),
        mounted() {
            const _this = this
            setTimeout(function () {
                if (_this.checkGoogleLoggedIn())
                    _this.$router.push({name: 'LichDay'})
            }, 2000)
        },
        methods:
            {
                loginUser() {
                    var _this = this
                    _this.isLoading = true;
                    let uri = url.url + '/api/login';
                    Axios.post(uri, _this.Login).then((response) => {
                        if (response.status == 200) {
                            localStorage.setItem('author', JSON.stringify(response.data.data))
                            _this.success = 'Đăng nhập thành công'
                            if (response.data.data.role_id == 1) {
                                setTimeout(() => {
                                    _this.success = '';
                                    _this.$router.push({name: 'LichDayGV'})
                                }, 300);
                            } else {
                                setTimeout(() => {
                                    _this.success = '';
                                    _this.$router.push({name: 'MuonPhongKtv'})
                                }, 300);
                            }
                        }
                    }).catch(error => {
                        if (!error.response) {
                            // network error
                            this.errorStatus = 'Error: Network Error'
                        } else {
                            _this.info = error.response.data.message;
                            setTimeout(() => {
                                _this.info = '';
                            }, 2000);
                        }
                    })
                },
                sendmail() {
                    var _this = this
                    _this.$router.push({name: 'SendEmail'})
                },
                async signInGoogle() {
                    var _this = this
                    const googleAuth = gapi.auth2.getAuthInstance()
                    const googleUser = await googleAuth.signIn({prompt: 'select_account', ux_mode: 'popup'})
                    var data = {
                        access_token: googleUser.Zi.access_token
                    };
                    try {
                        var response = await Axios.post(url.url + '/api/google', data)
                        if (response.status == 200) {
                            localStorage.setItem('author', JSON.stringify(response.data.data))
                            _this.success = 'Đăng nhập thành công'
                            if (response.data.data.role_id == 1) {
                                setTimeout(() => {
                                    _this.success = '';
                                    _this.$router.push({name: 'LichDayGV'})
                                }, 300);
                                console.timeEnd("Time this");
                            } else {
                                setTimeout(() => {
                                    _this.success = '';
                                    _this.$router.push({name: 'MuonPhongKtv'})
                                }, 300);
                            }
                        }
                    } catch (error) {
                        _this.info = error.response.data.message;
                        setTimeout(() => {
                            _this.info = '';
                        }, 2000)
                        googleAuth.signOut()
                    }
                    // Axios.post(_this.url + '/api/google', data).then((response)=>{
                    //     if (response.status == 200) {
                    //         console.log('signInGoogle success', response)
                    //         localStorage.setItem('author', JSON.stringify(response.data.data))
                    //         this.$router.push({name: 'LichDay'})
                    //         return
                    //     }
                    // }).catch(error => {
                    //     if (!error.response) {
                    //         // network error
                    //         this.errorStatus = 'Error: Network Error'
                    //         console.log(error.response.data.message)
                    //     } else {
                    //         this.errorStatus = error.response.data.message
                    //         googleAuth.signOut()
                    //         alert(this.errorStatus)
                    //     }
                    // })

                },
                checkGoogleLoggedIn() {
                    if (typeof gapi !== undefined) {
                        const _gapi = gapi ? gapi : window.gapi;
                        const googleAuth = _gapi.auth2.getAuthInstance();
                        return googleAuth.isSignedIn.get()
                    }
                },
                onSignInSuccess(response) {
                    var _this = this
                    _this.isLoading = true
                    var data = {
                        access_token: response.authResponse.accessToken
                    }
                    console.log(data);
                    // Axios.post(_this.url + '/api/facebook', data).then((response) => {
                    //     localStorage.setItem('author', JSON.stringify(response.data.data))
                    //     if (response.data.data.role_id == 1) {
                    //         setTimeout(() => {
                    //             _this.success = '';
                    //             _this.$router.push({name: 'LichDayGV'})
                    //         }, 300);
                    //         console.timeEnd("Time this");
                    //     } else {
                    //         setTimeout(() => {
                    //             _this.success = '';
                    //             _this.$router.push({name: 'MuonPhongKtv'})
                    //         }, 300);
                    //     }
                    // }).catch(error => {
                    //     if (!error.response) {
                    //         // network error
                    //         this.errorStatus = 'Error: Network Error'
                    //         console.log(error.response.data.message)
                    //     } else {
                    //         _this.info = error.response.data.message;
                    //         setTimeout(() => {
                    //             _this.info = '';
                    //         }, 2000);
                    //         FB.logout(function (response) {
                    //             console.log('logout', response);
                    //         });
                    //     }
                    // })
                },
                logoutFB() {
                    FB.logout(function (response) {
                        console.log('logout', response);
                    });
                },
                 checkLoginState() {
                    var _this = this
                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            // Logged into your app and Facebook.
                            console.log('Welcome!  Fetching your information.... ');
                            var data ={
                                access_token: response.authResponse.accessToken
                            }
                             Axios.post(url.url + '/api/facebook', data).then((res) => {
                                localStorage.setItem('author', JSON.stringify(res.data.data))
                                _this.success = 'Đăng nhập thành công',
                                    setTimeout(() => {
                                        _this.success = '';
                                        _this.$router.push({name: 'LichDay'})
                                    }, 2000);
                                return
                            });
                        }
                    });
                }
                // Google Auth object.
            },
        props: {
            source: String
        }
    }
</script>

<style scoped>
    .custom-social {
        position: relative;
        width: 15px;
        max-width: 50px;
        margin-right: 5px;
    }
    .login-social-google:hover,
    .v-btn--active:before, .v-btn:focus:before, .v-btn:hover:before{
        box-shadow: 0 0 3px 3px rgba(66,133,244,.3) !important;
        background: #fff !important;
    }

    .login-social-google {
        background-color: #fff !important;

    }
    .login-social {
        cursor: pointer;
        border: none;color: white;
        padding: 15px 15px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;cursor: pointer;
    }
    .fa-facebook {
        background: #3B5998;
        color: white;
    }
    .fa-facebook-f:before, .fa-facebook:before{
        padding-right: 5px;
    }

</style>