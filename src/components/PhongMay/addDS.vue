<template>
    <div id="app">
        <v-app id="inspire">
            <v-form v-model="valid" v-on:submit.prevent="savePhongMay" method="POST">
                <v-text-field
                        v-model="data.name"
                        label="Tên Phòng Máy"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="data.so_may"
                        label="Số Máy"
                        required
                ></v-text-field>
                <v-textarea
                        v-model="data.mo_ta"
                        label="Mô Tả"

                        required
                ></v-textarea>

                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListPhongMay'}">Quay Lại</v-btn>
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
    export default {
        name: "addDS",
        data: () => ({
            valid: false,
            data: {
                name: '',
                so_may:'',
                mo_ta:'',

            },
            success:'',
            info:'',
            //url: 'https://luanvantn.dev.digiprojects.top',
            url: 'http://localhost:8000',
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
                savePhongMay() {
                    var _this = this;
                    _this.isLoading = true;
                    let uri = _this.url + '/api/phong-may';
                    console.log(_this.data);
                    Axios.post(uri, _this.data,{headers:{Authorization: 'Bearer' + ' ' + _this.token}}).then((response) => {
                        if(response.status == 200){
                            _this.success = 'Thêm Phòng Máy Thành Công';
                            setTimeout(() => {
                                _this.success = '';
                                _this.$router.push({name:'ListPhongMay'});
                            }, 3000)
                        }
                    }).catch(e =>{
                        if (!e.response) {
                            // network error
                            this.e = 'Error: Network Error';
                        } else {
                            _this.info = error.response.data.message;
                            setTimeout(() => {
                                _this.info = '';
                            }, 3000);
                        }
                    });
                },
            },
        created() {
            var _this = this;
            let author = localStorage.getItem('author');
            let Auth = JSON.parse(author);
            _this.id = Auth['id'];
            _this.token = Auth['token'];
        }
    }

</script>

<style scoped>

</style>