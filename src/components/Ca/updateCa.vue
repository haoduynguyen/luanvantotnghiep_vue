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
            <v-form v-model="valid" v-on:submit.prevent="updateCa" method="put">
                <v-text-field
                        v-model="data.name"
                        label="Ca"
                        disabled
                        required
                ></v-text-field>
                <v-text-field
                        v-model="data.description"
                        label="Chi Tiết"
                        disabled
                        required
                ></v-text-field>
                <v-time-picker
                        v-model="data.gio_bat_dau"
                        label="Giờ Bắt Đầu"
                        required
                ></v-time-picker>
                <v-time-picker
                        v-model="data.gio_ket_thuc"
                        label="Giờ Kết Thúc"
                        required
                ></v-time-picker>
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListCa'}">Quay Lại</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Lưu</v-btn>
                </v-card-actions>
            </v-form>
        </v-app>
    </div>
</template>

<script>
    export default {
        name: "updateCa",
        data: () => ({
            valid: false,
            data: {
                name: '',
                description: '',
                gio_bat_dau: '',
                gio_ket_thuc: '',
            },
            //url: 'https://luanvantn.dev.digiprojects.top',
            url: 'http://localhost:8000',
            success:'',
            info:'',
        }),
        methods: {
            updateCa: function () {
                var _this = this;
                Axios.put(_this.url + '/api/ca/' + _this.data.id, _this.data,{ headers: {
                        Authorization: 'Bearer' + ' ' + this.token
                    }}).then((response) => {
                    if (response.status  == 200) {
                        _this.success = 'Sửa thành công';
                        setTimeout(() => {
                            _this.success = '';
                            _this.$router.push({name: 'ListCa'})
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
            let ca_id = urlCurrent.slice(urlCurrent.lastIndexOf('update-ca/') + 10, urlCurrent.length);

            let uri = _this.url + '/api/ca/' + ca_id + '/edit';
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