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
            <v-form v-model="valid" v-on:submit.prevent="updateMay" method="put">
                <v-text-field
                        v-model="data.name"
                        label="Tên Phòng Máy"
                        disabled
                        required
                ></v-text-field>
                <v-text-field
                        v-model="data.so_may"
                        label="Số Lượng Máy"
                        required
                ></v-text-field>
                <v-text-field
                        v-model="data.mo_ta"
                        label="Mô Tả"
                        required
                ></v-text-field>
                <v-textarea
                        v-model="data.ghi_chu"
                        label="Ghi Chú"
                        required
                ></v-textarea>
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListPM'}">Quay Lại</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Lưu</v-btn>
                </v-card-actions>
            </v-form>
        </v-app>
    </div>
</template>

<script>
    import url from '../../middleware/domain';
    export default {
        name: "updateDS-ktv",
        data: () => ({
            valid: false,
            data: {
                name: '',
                mo_ta: '',
                so_may: '',
                ghi_chu:'',
            },
            //url: 'https://luanvantn.dev.digiprojects.top',
            //url: 'http://localhost:8000',
            success:'',
            info:'',
        }),
        methods: {
            updateMay: function () {
                var _this = this;

                Axios.put(url.url + '/api/phong-may/' + _this.data.id, _this.data,{ headers: {
                        Authorization: 'Bearer' + ' ' + this.token
                    }}).then((response) => {
                    if (response.status  == 200) {
                        _this.success = 'Cập Nhật Thành Công';
                        setTimeout(() => {
                            _this.success = '';
                            _this.$router.push({name: 'ListPhongMay'})
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
            let phongmay_id = urlCurrent.slice(urlCurrent.lastIndexOf('update-ds-ktv/') + 14, urlCurrent.length);

            let uri = url.url + '/api/phong-may/' + phongmay_id + '/edit';
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