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
            <v-form v-model="valid" v-on:submit.prevent="editMonHoc" method="put">
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
                    <v-btn v-bind:to="{name: 'ListMonHoc'}">Trở về</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Lưu</v-btn>
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
            data: {
                ma_mon_hoc: '',
                name: '',
            },
            url: 'https://luanvantn.dev.digiprojects.top',
            //url: 'http://localhost:8000',
            success:'',
            info:'',
        }),
        methods: {
            editMonHoc: function () {
                var _this = this;
                Axios.put(_this.url + '/api/mon-hoc/' + _this.data.id, _this.data,{ headers: {
                        Authorization: 'Bearer' + ' ' + this.token
                    }}).then((response) => {
                    if (response.status  == 200) {
                        _this.success = 'Sửa thành công';
                        setTimeout(() => {
                            _this.success = '';
                            _this.$router.push({name: 'ListMonHoc'})
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
            var _this = this;
            _this.isLoading = true;
            let author = localStorage.getItem('author');
            let Auth = JSON.parse(author);
            _this.id = Auth['id'];
            _this.token = Auth['token'];
            let urlCurrent = window.location.href;
            let monhoc_id = urlCurrent.slice(urlCurrent.lastIndexOf('edit-mon-hoc/') + 13, urlCurrent.length);
            let uri = _this.url + '/api/mon-hoc/' + monhoc_id + '/edit';
            console.log('aaa',uri);
            Axios.get(uri,{ headers: {
                    Authorization: 'Bearer' + ' ' + this.token
                }}).then((response) => {
                _this.data = response.data.data;
                console.log(_this.data);
                // this.giangVien.profile.gender = this.switch1 ? 1 : null
            });
        }

    }
</script>

<style scoped>

</style>