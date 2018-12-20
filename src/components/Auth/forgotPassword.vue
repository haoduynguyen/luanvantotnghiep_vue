<template>
    <v-content>
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Forgot Password</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-model="drawer" v-on:submit.prevent="forgotPassword" method="POST">
                                <v-text-field prepend-icon="person" name="login" label="Password" v-model="Login.password"
                                              id="password" type="password"></v-text-field>
                                <v-text-field prepend-icon="lock" name="password" label="Password confirmation"
                                              v-model="Login.password_confirmation" id="password" type="password"></v-text-field>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Submit</v-btn>
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
        name: "forgotPassword",
        data: () => ({
            drawer: null,
            Login: {
                email:'',
                token:'',
                password: '',
                password_confirmation: '',
            },
            url: "https://luanvantn.dev.digiprojects.top",
        }),
        methods:
            {
                forgotPassword() {
                    var _this = this
                    _this.isLoading = true
                    let uri = _this.url + '/api/password/reset'
                    let str = window.location.href
                    let cutStrToken = str.slice(str.lastIndexOf('forgot-password/') + 16, str.lastIndexOf('?'))
                    let cutStrEmail = str.slice(str.lastIndexOf('?email=') + 7)
                    let email = cutStrEmail.replace('%40', '@')
                    _this.Login.email = email
                    _this.Login.token = cutStrToken
                    Axios.post(uri, _this.Login).then((response) => {
                        if (response.status == 200) {
                            alert('Đổi mật khẩu thành công')
                            this.$router.push({name: 'Login'})
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
            },

        props: {
            source: String
        }
    }
</script>

<style scoped>

</style>