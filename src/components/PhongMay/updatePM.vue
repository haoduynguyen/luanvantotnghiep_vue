<template>
    <div id="app">
        <v-app id="inspire">
            <v-card flat tile>
                <v-toolbar color="cyan" dark>
                    <v-toolbar-title>Cập Nhật Tình Trạng Máy </v-toolbar-title>
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
                        label="Mô Tả"
                        hint="Hint text"
                        v-model="showData.mota_gv"
                ></v-textarea>


                <!--<v-switch-->
                <!--:label="`Gender: ${switch1.toString() == 'true' ? 'male' : 'female'}`"-->
                <!--&gt;</v-switch>-->
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'ListMayLoi'}"><v-icon dark left>arrow_back</v-icon>Quay Lại</v-btn>
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
        name: "updatePM",
        props: {
            id: [String, Number]
        },
        data: () => ({
            valid: false,
            showData: {
                phong_may: {
                    name: ''
                },
                mota_gv:'',
            },
            token:'',
            //url: 'https://luanvantn.dev.digiprojects.top',
            //url: 'http://localhost:8000',
        }),
        //viet cac ham xu ly
        methods: {
            update: function () {
                var _this = this;

                let uri = url.url + '/api/update-mo-ta/';
                var gvItem = {
                    mota_gv: _this.showData.mota_gv,
                }
                Axios.put(uri + this.id,gvItem,{
                    headers:{
                        Authorization: 'Bearer' + ' ' + this.token
                    }
                }).then((response) => {
                    _this.isLoading = false;
                    //this.showData = response.data.data;
                    if(response.status == 200)
                    {
                      alert("Cập Nhật Mô Tả Thành Công");
                      _this.$router.push({name: 'ListMoTaGV'})
                    }
                    //console.log(response);
                })
            }
        },
        //viet cac ham mac dinh chay truoc khi load
        created: function () {
            var _this = this;
            let author = localStorage.getItem('author')
            let user = JSON.parse(author); // parse tu chuoi sang mang
            _this.token = user['token']
            console.log('TOKEN',_this.token);

            _this.isLoading = true;
            let uri = url.url + '/api/show-mo-ta-id/';
            Axios.get(uri + this.id).then((response) => {

                _this.isLoading = false;
                this.showData = response.data.data;
                console.log(this.showData);
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                    console.log(error.response.data.message);
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
        },
        mounted() {
            console.log('id', this.id);
        }

    }
</script>

<style>
    .custom-style .v-text-field__slot {
        height: 65px  ;
    }
</style>