<template>
    <v-content>
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Tìm tài khoản của bạn</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-on:submit.prevent="sendmail" method ="POST">
                                <label>Vui lòng nhập email để tìm kiếm tài khoản.</label>
                                <v-text-field prepend-icon="lock" label="Email" v-model="sendMail.email"></v-text-field>
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
        name: "sendEmail",
        data: () => ({
            drawer: null,
            sendMail: {
                email: '',
            },
            url: "http://localhost:8000"
        }),
        methods:
            {
                sendmail() {
                    var _this = this
                    _this.isLoading = true
                    let uri = _this.url + '/api/password/email'
                    var data ={
                        email: _this.sendMail.email,
                    }
                    console.log(_this.sendMail.email);
                    Axios.post(uri, data).then((response) => {
                        //console.log(response);
                        if(response.status == 200)
                        {
                            this.$router.push({name: 'EmailNotification'})
                        }
                    })
                }
            },

        props: {
            source: String
        }
    }
</script>

<style scoped>

</style>