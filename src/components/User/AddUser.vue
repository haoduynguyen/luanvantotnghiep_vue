<template>
    <div id="app">
        <v-app id="inspire">
            <v-form v-model="valid" v-on:submit.prevent="addUser" method="POST">
                <v-text-field
                        v-model="dataUser.email"
                        :rules="emailRules"
                        :counter="10"
                        label="email"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="dataUser.first_name"
                        label="First Name"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="dataUser.last_name"
                        label="Last Name"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="dataUser.password"
                        type="password"
                        label="password"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="dataUser.password_confirmation"
                        type="password"
                        label="confirm password"
                        required
                ></v-text-field>
                <v-switch
                        :label="`Gender: ${switch1.toString() == 'true' ? 'male' : 'female'}`"
                        v-model="switch1"
                ></v-switch>
                <v-select
                        :items="roleList"
                        label="Chức vụ"
                        item-text="name"
                        item-value="id"
                        v-model="dataUser.role_id"
                ></v-select>
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListUser'}">Trở về</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Lưu</v-btn>
                </v-card-actions>
            </v-form>
        </v-app>
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
    </div>
</template>

<script>
    import url from '../../middleware/domain';
    export default {
        name: "AddUser",
        data: () => ({
            valid: false,
            dataUser: {
                email: '',
                first_name: '',
                last_name: '',
                password: '',
                password_confirmation: '',
                phone: '123456789',
                gender: '',
                role_id: '',
            },
            success: '',
            info: '',
            //url: 'https://luanvantn.dev.digiprojects.top',
            //url: 'http://localhost:8000',
            switch1: true,
            roleList: [],
            nameRules: [
                v => !!v || 'Name is required',
                v => v.length <= 10 || 'Name must be less than 10 characters'
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ]
        }),
        methods:
            {
                addUser() {
                    var _this = this;
                    _this.isLoading = true;
                    _this.dataUser.gender = _this.switch1 ? 1 : 0
                    let uri = url.url + '/api/user';
                    Axios.post(uri, _this.dataUser).then((response) => {
                        if (response.status == 200) {
                            _this.success = 'Thêm user thành công';
                            setTimeout(() => {
                                _this.success = '';
                                _this.$router.push({name: 'ListUser'});
                            }, 3000)
                        }
                    }).catch(error => {
                        _this.info = error.response.data.message;
                        console.log(_this.info);
                        setTimeout(() => {
                            _this.info = '';
                        }, 3000);
                    });
                },
                getRole() {
                    var _this = this;
                    let uri = url.url + '/api/role';
                    Axios.get(uri).then((response) => {
                        _this.roleList = response.data.data;
                    });
                }
            },
        created() {
            this.getRole()
        }
    }

</script>

<style scoped>

</style>