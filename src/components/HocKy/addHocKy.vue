<template>
    <div id="app">
        <v-app id="inspire">
            <v-form v-model="valid" v-on:submit.prevent="saveHocKy" method="POST">
                <v-text-field
                        v-model="data.name"
                        label="Tên Học Kỳ"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="data.nam_hoc"
                        label="Năm Học"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="data.ngay_bat_dau"
                        label="Ngày bắt đầu"
                        type = 'date'
                        required
                ></v-text-field>
                <v-text-field
                        v-model="data.ngay_ket_thuc"
                        label="Ngày kết thúc"
                        type = 'date'
                        required
                ></v-text-field>
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListHocKy'}">Back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Save</v-btn>
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
        name: "addHocKy",
        data: () => ({
            valid: false,
            data: {
                name: '',
                name_hoc:'',
                ngay_bat_dau:'',
                ngay_ket_thuc:'',
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
                saveHocKy() {
                    var _this = this;
                    _this.isLoading = true;
                    let uri = _this.url + '/api/hoc-ky';
                    console.log(_this.data);
                    Axios.post(uri, _this.data,{headers:{Authorization: 'Bearer' + ' ' + _this.token}}).then((response) => {
                        if(response.status == 200){
                            _this.success = 'Thêm Học Kỳ thành công';
                            setTimeout(() => {
                                _this.success = '';
                                _this.$router.push({name:'ListHocKy'});
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