<template>
    <v-layout justify-center>

    <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
            <v-card-title class="headline">Are you sure?</v-card-title>
            <v-card-text>{{ warnContent }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click="importExcel(1), dialog = false">Yes</v-btn>
                <v-btn color="green darken-1" flat @click.native="dialog = false">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-flex xs12 sm10 md8 lg6>
        <v-card ref="form">
            <v-card-title>
                <p class="display-1">Import lịch dạy của giảng viên</p>
            </v-card-title>
            <v-form id="formData" v-model="valid" v-on:submit.prevent = "importExcel" method="POST">
                <v-card-text>

                    <v-alert :value="success" type="success" v-if="success != ''">
                        {{ success }}
                    </v-alert>

                    <v-alert :value="info" type="info" v-if="info != ''">
                        {{ info }}
                    </v-alert>

                    <v-alert :value="error" type="error" v-if="error != ''">
                        {{ error }} {{ downTime != 0 ? downTime : '' }}
                    </v-alert>

                    <v-select
                            :items="hockyList"
                            v-model="selectedHocky"
                            label="Học kỳ"
                            single-line
                            item-text="tenhocky"
                            item-value="id"
                            return-object
                            persistent-hint
                            :rules="hockyRules"

                    ></v-select>

                    <div class="file-upload">
                        <input type="file" id="fileInput" ref = "fileInput" v-on:change="onImageChange"/>
                        <v-btn class="btn-image"><img id="blah" alt="your image" style="width: 100%" v-bind:src="image" /></v-btn>
                        <p style="text-align: center; margin-top: 10px">Up file excel tại đây với đuôi file .xlsx</p>
                    </div>

                </v-card-text>
                <v-divider class="mt-5"></v-divider>
                <v-card-actions>
                    <v-btn v-bind:to="{name: 'LichDay'}">Back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Save</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-flex>
    </v-layout>

</template>

<script>
    import image from "../../assets/logo.png";
    export default {
        data: function () {
            return {
                urlCurrent: "http://luanvantn.dev.digiprojects.top",
                fetchError: '',
                downTime: 0,
                valid: false,
                switch1: false,
                image: image,
                name: '',
                hockyRules: [
                    v => !!v || 'Chưa chọn học kỳ',
                ],
                email: '',
                tab: null,
                hockyList: [],
                selectedHocky: 0,
                dialog: false,
                warnContent: '',
                success: '',
                info: '',
                error: '',

            }
        },
        methods: {
            importExcel(tieptuc = '0') {
                var _this = this;

                var formData = new FormData();
                var hocky_id = "";
                if(typeof _this.selectedHocky == 'number')
                    hocky_id = _this.selectedHocky;
                else
                    hocky_id = _this.selectedHocky.id;
                formData.append('id', '1');
                formData.append('file_import', this.$refs.fileInput.files[0]);
                formData.append('hoc_ky', hocky_id);
                formData.append('tiep_tuc', tieptuc);
                alert(tieptuc)


                if(_this.$refs.fileInput.files.length != 0) {
                    var fileName = _this.$refs.fileInput.files[0].name;
                    var fileType = fileName.slice(fileName.lastIndexOf('.') + 1 , fileName.length);
                    console.log(fileType);
                }
                //formData.fi
                if(this.$refs.fileInput.files.length == 0 || hocky_id == "")
                    _this.error = "Nội dung chưa đầy đủ";
                else if(fileType != 'xlsx')
                    _this.error = "Không phải file excel hoặc không phải đuôi file .xlsx";
                else {
                    _this.error = "";
                    _this.info = "File excel đang được import. Xin vui lòng chờ trong giây lát";
                }

                Axios.post(_this.urlCurrent + '/api/import-excel', formData).then((response) => {
                    console.log(response.data);
                    if(response.data.warn) {
                        _this.info = "";
                        _this.dialog = true;
                        _this.warnContent = response.data.warn;
                    }
                    if(response.data.success) {
                        _this.info = "";
                        _this.success = response.data.success;
                        setTimeout(() => {
                            _this.success= '';
                            _this.$router.push({name: 'LichDay'})
                        }, 1000);
                        _this.image = image;
                    }
                }).catch(function(error){
                    _this.error = error.response.data.message
                    _this.info = ""
                });
            },
            onImageChange(e) {
                this.image = image;
            },
        },
        created: function() {
            var _this = this;
            Axios.get(_this.urlCurrent+'/api/hoc-ky').then((response) => {
                // _this.hockyList = response.data;

                for(var hocky of response.data.data) {
                    let hockyItem = { id: hocky.id, tenhocky: hocky.name + ' - ' + hocky.nam_hoc, ngaybatdau: hocky.ngay_bat_dau, ngayketthuc: hocky.ngay_ket_thuc }
                    _this.hockyList.push(hockyItem);
                }
                console.log(_this.hockyList);
                var today = new Date();
                var date =  today.getFullYear()  + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
                //var ngayhientai = new Date(date).getTime();
                for(var hocky of _this.hockyList) {
                    console.log(hocky.ngay_bat_dau);
                    var ngaybatdau = hocky.ngaybatdau;
                    var ngayketthuc =hocky.ngayketthuc;
                    if(ngaybatdau <= date && date <= ngayketthuc) {
                        _this.selectedHocky = hocky.id;
                        console.log(_this.selectedHocky);
                        break;
                    }
                }
            }).catch(function (error) {
                _this.fetchError = 'Xin lỗi, máy chủ gặp vấn đề! Vui lòng load lại trang';
            });

            if(_this.fetchError != "") {
                _this.error = "Hệ thống không load được dữ liệu. Hệ thống sẽ quay lại trang lịch trực sau ";
                _this.downTime = 5;
                var countdownTimer = setInterval(function(){
                    _this.downTime--;
                    if(_this.downTime <= 0) {
                        clearInterval(countdownTimer);
                        _this.$router.push({name: 'LichDay'})
                    }
                },1000);
            }
        }
    }
</script>

<style scope>
    .changePass {
        animation: showchangepass 0.25s;
    }
    .file-upload {
        white-space: nowrap;
        position: relative;
        width: 250px;
        height: 250px;
        background-color: gold;
        margin: auto;
    }

    .file-upload input[type="file"] {
        position: absolute;
        top:0; left:0;
        height: 100%;
        z-index: 100;
        opacity: 0;
        cursor: pointer;
    }
    /* .file-upload input[type="file"]:hover + .btn-image {
      opacity: 0.5;
    } */
    .btn-image {
        padding: 0;
        margin: 0;
        background-color: #fff;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .btn-image .btn__content {
        padding: 0;
    }
    @keyframes showchangepass {
        from { opacity: 0 }
        to { opacity: 1 }
    }
</style>
