<template>
    <div id="app">
        <v-app id="inspire">
            <span>Giảng Viên: {{showData.giang_vien.profile.first_name + ' ' + showData.giang_vien.profile.last_name}}</span>
            <v-card flat tile>
                <v-toolbar color="cyan" dark>
                    <v-toolbar-title>Edit Kỹ Thuật Viên</v-toolbar-title>
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
                        label="Mô Tả Giảng Viên"
                        hint="Hint text"
                        v-model="showData.mota_gv"
                        disabled
                ></v-textarea>
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
                    <v-btn v-bind:to="{name: 'ListMayLoi'}">Back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Save</v-btn>
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
                    profile:{
                        first_name:'',
                        last_name:'',
                    },
                },

                mota_gv:'',
                mota_ktv:'',
            },
            token:'',
            url:'http://luanvantn.dev.digiprojects.top'
        }),
        //viet cac ham xu ly
        methods: {
            update: function () {
                var _this = this;

                let uri = _this.url + '/api/update-mo-ta/';
                var gvItem = {
                    mota_ktv: _this.showData.mota_ktv,
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
                        alert("Update Success");
                        _this.$router.push({name: 'ListMayLoi'})
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

            _this.isLoading = true;
            let uri = _this.url + '/api/show-mo-ta-id/';
            Axios.get(uri + this.id).then((response) => {

                _this.isLoading = false;
                this.showData = response.data.data;
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