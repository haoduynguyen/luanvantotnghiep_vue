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
                            <v-form v-model="drawer" v-on:submit.prevent="aaa" method="POST">
                                <v-text-field prepend-icon="person" name="login" label="Login" v-model="Login.email"
                                              type="text"></v-text-field>
                                <v-text-field prepend-icon="lock" name="password" label="Password"
                                              v-model="Login.password" id="password" type="password"></v-text-field>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Login</v-btn>
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
            url: "http://localhost:8000"
        }),
        methods:
            {
                aaa() {
                    var _this = this;
                    _this.isLoading = true;
                    let uri = _this.url + '/api/login';
                    Axios.post(uri, _this.Login).then((response) => {
                        if(response.status == 200)
                        {
                            localStorage.setItem('author', JSON.stringify(response.data.data));
                            this.$router.push({name: 'LichDay'})
                        }
                    }).catch(error => {
                        if (!error.response) {
                            // network error
                            this.errorStatus = 'Error: Network Error';
                            console.log(error.response.data.message);
                        } else {
                            this.errorStatus = error.response.data.message;
                           alert(this.errorStatus)
                        }
                    });;
                },
            },
        props: {
            source: String
        }
    }
</script>

<style scoped>

</style>