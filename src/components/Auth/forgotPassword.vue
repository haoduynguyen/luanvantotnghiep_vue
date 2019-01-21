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
                                               type="password"></v-text-field>
                                <v-text-field prepend-icon="lock" name="password" label="Password confirmation"
                                              v-model="Login.password_confirmation" type="password"></v-text-field>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Submit</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card-text>
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
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
    import url from '../../middleware/domain';
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
            //url: "https://luanvantn.dev.digiprojects.top",
            success:'',
            info:'',
        }),
        methods:
            {
                forgotPassword() {
                    var _this = this
                    _this.isLoading = true
                    let uri = url.url + '/api/password/reset'
                    let str = window.location.href
                    let cutStrToken = str.slice(str.lastIndexOf('forgot-password/') + 16, str.lastIndexOf('?'))
                    let cutStrEmail = str.slice(str.lastIndexOf('?email=') + 7)
                    let email = cutStrEmail.replace('%40', '@')
                    _this.Login.email = email
                    _this.Login.token = cutStrToken
                    Axios.post(uri, _this.Login).then((response) => {
                        if (response.status == 200) {
                            _this.success = 'Đổi mật khẩu thành công'
                            setTimeout(() => {
                                _this.success = '';
                                this.$router.push({name: 'Login'})
                            }, 1000);
                        }
                    }).catch(error => {
                        _this.info = error.response.data.message;
                        setTimeout(() => {
                            _this.info = '';
                        }, 2000)
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