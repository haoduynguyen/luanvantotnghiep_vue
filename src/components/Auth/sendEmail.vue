<template>
    <v-content>
        <div class=""></div>
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
                            <v-toolbar-title>Tìm tài khoản của bạn</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-on:submit.prevent="sendmail" method="POST">
                                <label>Vui lòng nhập email để tìm kiếm tài khoản.</label>
                                <v-text-field :disabled="loadingSendMail != '' ? true : false" prepend-icon="lock" label="Email" v-model="sendMail.email"></v-text-field>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="loadingSendMail != '' ? true : false" type="submit" class="btn btn-xs btn-primary" color="success">Submit</v-btn>
                                </v-card-actions>
                            </v-form>
                            <v-progress-circular
                                    v-if="loadingSendMail != ''"
                                    class="loader-sendmail"
                                    :size="70"
                                    :width="7"
                                    color="red"
                                    indeterminate
                            ></v-progress-circular>
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
            url: "https://luanvantn.dev.digiprojects.top",
            //url: "http://localhost:8000",
            loadingSendMail: '',
            info: '',
        }),
        methods:
            {
                 sendmail() {
                    var _this = this
                    _this.isLoading = true
                    let uri = _this.url + '/api/password/email';
                    _this.loadingSendMail = 'đang send mail';
                    var data = {
                        email: _this.sendMail.email,
                    }
                    Axios.post(uri, data).then((response) => {
                        //console.log(response);
                        if (response.status == 200) {
                            _this.$router.push({name: 'EmailNotification'});
                        }
                    }).catch((error) => {
                        if (error) {
                            _this.info = 'Email của bạn không hợp lệ .Vui lòng kiểm tra email';
                            _this.loadingSendMail = '';
                            console.clear();
                            setTimeout(() => {
                                _this.info = ''
                            }, 2000)
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
.loader-sendmail {
    position: absolute;
    top: 62%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>