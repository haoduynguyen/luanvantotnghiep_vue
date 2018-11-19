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
                                    <v-btn  class="btn btn-xs btn-primary" @click="signInGoogle">G Login</v-btn>
                                    <v-spacer></v-spacer>

                                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Login</v-btn>
                                </v-card-actions>
                                <v-card-actions>
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
            url: "http://luanvantn.dev.digiprojects.top",
            urlSendMail:"http://lvtn.cf"
        }),
        mounted() {
            const _this = this
            setTimeout(function () {
                if (_this.checkGoogleLoggedIn()) _this.$router.push({name: 'LichDay'})
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
                    console.log(data);
                    let response = await Axios.post(_this.url + '/api/google', data)
                    if (response.status == 200) {
                        console.log('signInGoogle success', response)
                        localStorage.setItem('author', JSON.stringify(response.data.data))
                        this.$router.push({name: 'LichDay'})
                        return
                    }
                    alert('Server error')
                    if (!response.response) {
                        console.log('signInGoogle fail', error.response.data.message)
                        alert(error.response.data.message)
                    } else {
                        console.log('signInGoogle fail', error.response.data.message)
                        alert(error.response.data.message)
                    }
                },
                checkGoogleLoggedIn() {
                    if (typeof gapi !== undefined) {
                        const _gapi = gapi ? gapi : window.gapi
                        const googleAuth = _gapi.auth2.getAuthInstance()
                        return googleAuth.isSignedIn.get()
                    }

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