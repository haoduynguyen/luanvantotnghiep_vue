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
            <v-form v-model="valid" v-on:submit.prevent="updateHK" method="put">
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
                        required
                ></v-text-field>
                <v-text-field
                        v-model="data.ngay_ket_thuc"
                        label="Ngày kết thúc"
                        required
                ></v-text-field>
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListHocKy'}">Back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Save</v-btn>
                </v-card-actions>
            </v-form>
        </v-app>
    </div>
</template>

<script>
    export default {
        name: "updateHocKy",
        data: () => ({
            valid: false,
            data: {
                name: '',
                nam_hoc: '',
                ngay_bat_dau:'',
                ngay_ket_thuc:'',
            },
            url: 'https://luanvantn.dev.digiprojects.top',
            //url: 'http://localhost:8000',
            success: '',
            info: '',
        }),
        methods: {
            updateHK: function () {
                var _this = this;
                Axios.put(_this.url + '/api/hoc-ky/' + _this.data.id, _this.data, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + this.token
                    }
                }).then((response) => {
                    if (response.status == 200) {
                        _this.success = 'Sửa thành công';
                        setTimeout(() => {
                            _this.success = '';
                            _this.$router.push({name: 'ListHocKy'})
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
            let hocky_id = urlCurrent.slice(urlCurrent.lastIndexOf('update-hoc-ky/') + 14, urlCurrent.length);
            let uri = _this.url + '/api/hoc-ky/' + hocky_id + '/edit';
            console.log('aaa', uri);
            Axios.get(uri, {
                headers: {
                    Authorization: 'Bearer' + ' ' + this.token
                }
            }).then((response) => {
                _this.data = response.data.data;
                console.log(_this.data);
                // this.giangVien.profile.gender = this.switch1 ? 1 : null
            });
        }

    }
</script>

<style scoped>

</style>