<template>
    <div id="app">
        <v-app id="inspire">
            <v-form v-model="valid" v-on:submit.prevent="addMonHoc" method="POST">
                <v-text-field
                        v-model="data.ma_mon_hoc"
                        label="Mã môn học"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="data.name"
                        label="Tên môn học"
                        required
                ></v-text-field>
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListMonHoc'}">Quay Lại</v-btn>
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
        name: "add",
        data: () => ({
            valid: false,
            data: {
                ma_mon_hoc: '',
                name: '',
            },
            success:'',
            info:'',
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
                addMonHoc() {
                    var _this = this;
                    _this.isLoading = true;
                    let uri = url.url + '/api/mon-hoc';
                    console.log(_this.data);
                    Axios.post(uri, _this.data,{headers:{Authorization: 'Bearer' + ' ' + _this.token}}).then((response) => {
                        if(response.status == 201){
                            _this.success = 'Tạo Môn Học Thành Công';
                            setTimeout(() => {
                                _this.success = '';
                                _this.$router.push({name:'ListMonHoc'});
                            }, 3000)
                        }
                    }).catch(error =>{
                        _this.info = error.response.data.message
                        console.log(_this.info);
                        setTimeout(() => {
                            _this.info = '';
                        }, 3000);
                        _this.dialog = false
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