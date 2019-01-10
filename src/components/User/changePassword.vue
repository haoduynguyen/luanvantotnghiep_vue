<template>
    <div id="app">
        <v-app id="inspire">
            <v-form v-model="valid" v-on:submit.prevent="changePassword" method="put">
                <v-text-field
                        v-model="dataUser.oldPassword"
                        type="password"
                        label="Password"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="dataUser.newPassword"
                        type="password"
                        label="New Password"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="dataUser.passwordConfirmation"
                        type="password"
                        label="Password confirmation"
                        required
                ></v-text-field>
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'LichDay'}">Trở về</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Lưu</v-btn>
                </v-card-actions>
            </v-form>
        </v-app>
    </div>
</template>

<script>
    export default {
        name: "changePassword",

        data: () => ({
            valid: false,
            dataUser: {
                oldPassword: '',
                newPassword: '',
                passwordConfirmation: ''
            },
            //url: 'https://luanvantn.dev.digiprojects.top',
            url: 'http://localhost:8000',
            id: 0,
        }),
        methods: {
            changePassword() {
                var _this = this
                var data = {
                    old_password: _this.dataUser.oldPassword,
                    new_password: _this.dataUser.newPassword,
                    new_password_confirmation: _this.dataUser.passwordConfirmation
                }
                Axios.put(_this.url + '/api/change-password/' + _this.id, data).then((response) => {
                    console.log(response);
                    if (response.status == 200) {
                        alert('update success')
                        localStorage.clear();
                        _this.$router.push({name: 'Login'})
                        _this.error = '';
                    }
                }).catch(error => {
                    _this.error = error.response.data.message
                    alert(_this.error)
                    _this.info = ""
                });
            }
        },
        created: function () {
            let author = localStorage.getItem('author')
            let user = JSON.parse(author);
            this.id = user['id']
        },
    }
</script>

<style scoped>

</style>