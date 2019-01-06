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
    </div>
</template>

<script>
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
            ]
        }),
        methods:
            {
                addUser() {
                    var _this = this;
                    _this.isLoading = true;
                    _this.dataUser.gender = _this.switch1 ? 1 : 0
                    let uri = _this.url + '/api/user';
                    console.log(_this.switch1);
                    console.log(_this.dataUser);
                    console.log(_this.dataUser);
                    Axios.post(uri, _this.dataUser).then((response) => {
                        alert('Add User Success!');
                    });
                },
                getRole() {
                    var _this = this;
                    let uri = _this.url + '/api/role';
                    console.log(_this.url);
                    Axios.get(uri).then((response) => {
                        _this.roleList = response.data.data;
                        console.log('Role');
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