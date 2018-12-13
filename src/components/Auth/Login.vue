<template>
    <v-content>
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Login</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-model="drawer" v-on:submit.prevent="loginUser" method="POST">
                                <v-text-field prepend-icon="person" name="login" label="Login" v-model="Login.email"
                                              type="text"></v-text-field>
                                <v-text-field prepend-icon="lock" name="password" label="Password"
                                              v-model="Login.password" id="password" type="password"></v-text-field>
                                <v-card-actions>
                                    <v-btn class="btn btn-xs btn-primary" @click="signInGoogle">G Login</v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Login</v-btn>
                                </v-card-actions>
                                <v-card-actions>
                                    <fb-signin-button
                                            :params="fbSignInParams"
                                            @success="onSignInSuccess"
                                            @onlogin="checkLoginState" style="cursor: pointer; background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;
                                                                              text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;">
                                        Sign in with Facebook
                                    </fb-signin-button>
                                    <v-spacer></v-spacer>
                                    <a v-bind:href="urlSendMail +'/send-email' "> Forgot Password??? </a>
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
            //url: "http://luanvantn.dev.digiprojects.top",
            //url: 'http://localhost:8000',
            url:'http://luanvantn.dev.digiprojects.top',
            urlSendMail: "http://lvtn.cf"
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
                    _this.isLoading = true
                    let uri = _this.url + '/api/login'
                    Axios.post(uri, _this.Login).then((response) => {
                        if (response.status == 200) {
                            console.log(response)
                            localStorage.setItem('author', JSON.stringify(response.data.data))
                            this.$router.push({name: 'LichDay'})
                        }
                    }).catch(error => {
                        if (!error.response) {
                            // network error
                            this.errorStatus = 'Error: Network Error'
                            console.log(error.response.data.message)
                        } else {
                            this.errorStatus = error.response.data.message
                            alert(this.errorStatus)
                        }
                    })

                },
                sendmail() {
                    var _this = this
                    this.$router.push({name: 'SendEmail'})
                },
                async signInGoogle() {
                    var _this = this
                    const googleAuth = gapi.auth2.getAuthInstance()
                    const googleUser = await googleAuth.signIn({prompt: 'select_account', ux_mode: 'popup'})
                    var data = {
                        access_token: googleUser.Zi.access_token
                    }

                    try {
                        var response = await Axios.post(_this.url + '/api/google', data)
                        console.log('true', response);
                        if (response.status == 200) {
                            localStorage.setItem('author', JSON.stringify(response.data.data))
                            this.$router.push({name: 'LichDay'})
                            return
                        }
                    } catch (error) {
                        alert(error.response.data.message)
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
                        const _gapi = gapi ? gapi : window.gapi
                        const googleAuth = _gapi.auth2.getAuthInstance()
                        return googleAuth.isSignedIn.get()
                    }

                },
                onSignInSuccess(response) {
                    var _this = this
                    _this.isLoading = true
                    console.log('login', response.authResponse.accessToken);
                    var data = {
                        access_token: response.authResponse.accessToken
                    }
                    Axios.post(_this.url + '/api/facebook', data).then((response) => {
                        console.log(response);
                    })
                },
                logoutFB() {
                    console.log('aaa');
                    FB.logout(function (response) {
                        console.log('logout', response);
                    });
                },
                checkLoginState() {
                    FB.getLoginStatus(function (response) {
                        console.log('aaaa', response.authResponse.accessToken);
                        if (response.status === 'connected') {
                            // Logged into your app and Facebook.
                            console.log('Welcome!  Fetching your information.... ');
                            FB.api('/me', function (response) {
                                console.log('Successful login for: ' + response.name);
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

</style>