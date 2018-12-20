<template>
    <div id="app">
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
        <v-app id="inspire">
            <v-form v-model="valid" v-on:submit.prevent="editGiangVien" method="put">
                <v-text-field
                        v-model="giangVien.email"
                        :rules="emailRules"
                        :counter="10"
                        label="email"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="giangVien.profile.first_name"
                        label="Họ"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="giangVien.profile.last_name"
                        label="Tên"
                        hide-details
                        required
                ></v-text-field>
                <v-text-field
                        v-model="giangVien.profile.phone"
                        type="number"
                        label="Phone"
                        required
                ></v-text-field>
                <v-switch
                        :label="`Gender: ${switch1.toString() == 'true' ? 'male' : 'female'}`"
                        v-model="switch1"
                ></v-switch>
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListUser'}">Back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Save</v-btn>
                </v-card-actions>
            </v-form>
        </v-app>
    </div>
</template>

<script>
    export default {
        name: "edit",
        data: () => ({
            valid: false,
            giangVien: {
                email: '',
                password:'',
                profile: {
                    first_name: '',
                    last_name: '',
                    phone: '',
                    gender: '',
                },
            },
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            gender:0,
            url: 'https://luanvantn.dev.digiprojects.top',
            switch1: true,
            roleList: [],
            nameRules: [
                v => !!v || 'Name is required',
                v => v.length <= 10 || 'Name must be less than 10 characters'
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            success:'',
            info:'',
        }),
        methods: {
            editGiangVien: function () {
                var _this = this;
                var giangVienItem = {
                    first_name: _this.giangVien.profile.first_name,
                    last_name: _this.giangVien.profile.last_name,
                    email: _this.giangVien.email,
                    phone: _this.giangVien.profile.phone,
                    gender: _this.giangVien.profile.gender,
                }
                Axios.put(_this.url + '/api/user/' + _this.giangVien.id, giangVienItem).then((response) => {
                    if (response.status  == 200) {
                        _this.success = 'Sửa thành công';
                        setTimeout(() => {
                            _this.success = '';
                            window.location.reload()
                            _this.$router.push({name: 'MuonPhongKtv'})
                        }, 2000);
                    }
                }).catch(function (error) {
                    _this.info = error.response.data.message;
                    setTimeout(() => {
                        _this.info = '';
                    }, 2000);
                });
            }
        },
        created: function () {
            let urlCurrent = window.location.href;
            let giangvien_id = urlCurrent.slice(urlCurrent.lastIndexOf('edit-user/') + 10, urlCurrent.length);
            let uri = this.url + '/api/user/' + giangvien_id + '/edit';
            Axios.get(uri).then((response) => {
                this.giangVien = response.data.data;
                this.giangVien.profile.gender = this.switch1 ? 1 : null
            });
        }

    }
</script>

<style scoped>

</style>