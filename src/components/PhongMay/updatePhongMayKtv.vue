<template>
    <div id="app">
        <v-app id="inspire">
            <!--<span>Giảng Viên: {{showData.giang_vien.profile.first_name + ' ' + showData.giang_vien.profile.last_name}}</span>-->
            <v-card flat tile>
                <v-toolbar color="cyan" dark>
                    <v-toolbar-title>Cập Nhật Tình Trạng Máy</v-toolbar-title>
                </v-toolbar>
            </v-card>
            <v-form v-on:submit.prevent="update" method="post" class="custom-style">
                <v-text-field
                        type="text"
                        label="Phòng Máy"
                        style="margin-top: 15px"
                        v-model="showData.phong_may.name"
                        disabled
                ></v-text-field>

                <v-textarea
                        name="input-7-1"
                        label="Giảng Viên"
                        hint="Hint text"
                        v-model="showData.giang_vien.profile.first_name + ' ' + showData.giang_vien.profile.last_name"
                        disabled
                ></v-textarea>

                <v-textarea
                        name="input-7-1"
                        label="Mô Tả Giảng Viên"
                        hint="Hint text"
                        v-model="showData.mota_gv"
                        disabled
                ></v-textarea>

                        <v-radio-group v-model="ex7" row>
                            <v-radio
                                    label="Chưa Sửa"
                                    color="red"
                                    value="1"
                            ></v-radio>
                            <v-radio
                                    label="Đang Sửa"
                                    color="orange"
                                    value="2"
                            ></v-radio>
                            <v-radio
                                    label="Đã Sửa"
                                    color="indigo"
                                    value="3"
                            ></v-radio>
                        </v-radio-group>
                <v-textarea
                        name="input-7-1"
                        label="Mô Tả Kỹ Thuật Viên"
                        hint="Hint text"
                        v-model="showData.mota_ktv"
                ></v-textarea>

                <!--<v-switch-->
                <!--:label="`Gender: ${switch1.toString() == 'true' ? 'male' : 'female'}`"-->
                <!--&gt;</v-switch>-->
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListMayLoi'}">Quay Lại</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Lưu</v-btn>
                </v-card-actions>
            </v-form>
        </v-app>
    </div>
</template>

<script>
    export default {
        name: "updatePhongMayKtv",
        props: {
            id: [String, Number]
        },
        data: () => ({
            valid: false,
            showData: {
                phong_may: {
                    name: ''
                },
                giang_vien: {
                    profile: {
                        first_name: '',
                        last_name: '',
                    },
                },
                mota_gv: '',
                mota_ktv: '',
            },
            ex7: '',
            token: '',
            url: 'https://luanvantn.dev.digiprojects.top',
            //url: 'http://localhost:8000'
        }),
        //viet cac ham xu ly
        methods: {
            update: function () {
                var _this = this;
                let uri = _this.url + '/api/update-mo-ta/';
                var gvItem = {
                    mota_ktv: _this.showData.mota_ktv,
                    status : _this.ex7
                }
                Axios.put(uri + this.id, gvItem, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + this.token
                    }
                }).then((response) => {
                    _this.isLoading = false;
                    _this.showData = response.data.data;
                    if (response.status == 200) {
                        alert("Cập nhật Mô Tả Thành Công");
                        _this.$router.push({name: 'ListMayLoi'})
                    }
                })
            }
        },
        //viet cac ham mac dinh chay truoc khi load
        created: function () {
            var _this = this;
            let author = localStorage.getItem('author')
            let user = JSON.parse(author); // parse tu chuoi sang mang
            _this.token = user['token']

            _this.isLoading = true;
            let uri = _this.url + '/api/show-mo-ta-id/';
            Axios.get(uri + this.id).then((response) => {
                _this.isLoading = false;
                _this.showData = response.data.data;
                if(_this.showData.status == 1){
                    _this.ex7 = '1';
                }else if(_this.showData.status == 2){
                    _this.ex7 = '2'
                } else{
                    _this.ex7 = '3'
                }
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                    alert(error.response.data.message);
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
        },
        mounted() {
        }

    }
</script>

<style>
    .custom-style .v-text-field__slot {
        height: 65px;
    }
</style>