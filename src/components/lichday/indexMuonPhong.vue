<template>
    <div>
        <div class="text-xs-center">
            <v-dialog
                    v-model="hueky"
                    width="500"
            >

                <v-card>
                    <v-card-title class="headline grey lighten-2" v-if="mota_pm == ''" primary-title>
                        Số Máy:   {{ mota_pm.so_may}}
                    </v-card-title>

                    <v-card-text v-if="mota_pm == ''">
                        Mô tả: {{ mota_pm.mota}}
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <v-form id="formData" v-on:submit.prevent="searchLichDay">
            <div style="display: flex">
                <v-select class="test"
                          :items="dataLich.curentTuan"
                          v-model="dataLich.selectedTuan"
                          label="Tuần"
                          single-line
                          item-text="description"
                          item-value="id"
                          return-object
                          persistent-hint
                ></v-select>
                <v-spacer></v-spacer>
                <v-select class="test"
                          :items="dataLich.hocKyList"
                          v-model="dataLich.selectedHocKy"
                          label="Học Kỳ"
                          single-line
                          item-text="tenhocky"
                          item-value="id"
                          return-object
                          persistent-hint
                ></v-select>
                <v-spacer></v-spacer>
                <v-select class="test"
                          :items="dataLich.phongMayList"
                          v-model="dataLich.selectedPhongMay"
                          label="Phòng Máy"
                          single-line
                          item-text="name"
                          item-value="id"
                          v-on:change="changeRoute"
                          return-object
                          persistent-hint
                ></v-select>

            </div>
            <v-card-actions>
                <v-btn v-bind:to="{name: 'importLichDay'}">Import</v-btn>
                <v-spacer></v-spacer>
                <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Submit</v-btn>
            </v-card-actions>
        </v-form>
        <div class="lichtruc-data">
            <div class="col-ca">
                <div class="ca-content" style="height: 50px">

                </div>
                <div class="ca-content" v-for="ca in dataLich.caList">
                    <p style="text-align: center; line-height: 150px; font-weight: bold">{{ ca.name }}</p>

                </div>

            </div>
            <div class="col-thu">
                <div class="row-thu">
                    <div class="thu-content">
                        <div v-for="thu in dataLich.thuList">
                            <p style="font-weight: bold">{{ thu.name }}</p>
                        </div>
                    </div>
                </div>
                <div class="lichtruc-content">
                    <div v-for="( thu, key ) in dataLich.thuList" :key="key" style="width: 14.28%;">
                        <div v-for="( ca, key ) in dataLich.caList" :key="key" class="lichtruc-content-block">
                            <div style="border: 1px solid white; height: 150px; background-color: #eeeeee">
                                <div v-if="checkLichTruc(ca.id,thu.id)=='' || ( checkLichTruc(ca.id, thu.id).dang_ky_nghi != null && checkLichTruc(ca.id,
                                        thu.id).dang_ky_nghi.tuan_id == selectTuan)" v-on:click="viewMuonPhong(ca.id, thu.id,checkLichTruc(ca.id,
                                        thu.id))"
                                     class="lichtruc-detail">
                                </div>

                                <div v-else class="lichtruc-detail"
                                     v-on:click="viewDetail(checkLichTruc(ca.id, thu.id))">
                                    {{ checkLichTruc(ca.id, thu.id).user.profile.first_name+ ' ' + checkLichTruc(ca.id,
                                    thu.id).user.profile.last_name }}
                                    <div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Lịch chi tiết</span>
                    </v-card-title>
                    <v-card-text v-if="detailContent">
                        <table style="width: 100%" class="table-view-detail">
                            <tr>
                                <td><strong>Phòng máy:</strong></td>
                                <td>{{ detailContent.phong_may.name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Ca: </strong></td>
                                <td>{{ detailContent.ca.name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Thứ: </strong></td>
                                <td>{{ detailContent.thu.name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Môn học: </strong></td>
                                <td>{{ detailContent.mon_hoc.name }}</td>
                            </tr>
                            <tr v-if=" detailContent.nhom_lop">
                                <td><strong>Lớp: </strong></td>
                                <td>{{ detailContent.nhom_lop.name }}</td>
                            </tr>
                        </table>
                    </v-card-text>

                </v-card>
            </v-dialog>
        </v-layout>
        <v-layout row justify-center>
            <v-dialog v-model="dialogdkMuonPhong" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Đăng Ký Mượn Phòng</span>
                        <v-select class="test"
                                  :items="dataLich.monList"
                                  v-model="dataLich.selectedMonHoc"
                                  label="Môn Học"
                                  single-line
                                  item-text="name"
                                  item-value="id"
                                  return-object
                                  persistent-hint
                        ></v-select>
                    </v-card-title>
                    <v-card-text v-if="detailMuonPhong && dangKyMuonPhong">
                        <table style="width: 100%" class="table-view-detail">
                            <tr>
                                <td><strong>Phòng máy:</strong></td>
                                <td>{{ dangKyMuonPhong.phong_may.name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Ca: </strong></td>
                                <td>{{ dangKyMuonPhong.ca.name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Thứ: </strong></td>
                                <td>{{ dangKyMuonPhong.thu.name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Môn học: </strong></td>
                                <td>{{ dangKyMuonPhong.mon_hoc.name }}</td>
                            </tr>
                        </table>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                                type="submit" v-on:click="submitMuonPhong()">Đăng Ký Mượn Phòng
                        </v-btn>
                        <v-spacer></v-spacer>
                        <!--<v-btn color="blue darken-1" flat @click.native="dialogdkMuonPhong = false">Close</v-btn>-->
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    export default {
        name: "indexMuonPhong",
        data: () => ({
            dataLich: {
                caList: "",
                thuList: "",
                monList: [],
                lichDay: [],
                tuanList: [],
                hocKyList: [],
                phongMayList: [],
                curentTuan: [],
                selectedTuan: 0,
                selectedHocKy: 0,
                selectedPhongMay: 0,
                selectedMonHoc: 0,
                statusCode: 0,
                ca_id: 0,
                thu_id: 0,
                thuNgayList: [],
            },
            mota_pm:'',
            selectTuan: 0,
            //url: 'http://luanvantn.dev.digiprojects.top',
            url: 'http://localhost:8000',
            dialog: false,
            dialogdkMuonPhong: false,
            hueky: false,
            detailContent: "",
            dangKyMuonPhong: [],
            detailMuonPhong: "",
            token: "",
        }),
        created: function () {
            var _this = this;
            _this.isLoading = true;
            let author = localStorage.getItem('author')
            let Auth = JSON.parse(author);
            _this.id = Auth['id'];
            _this.token = Auth['token'];
            // get danh sách ca
            let uriCa = _this.url + '/api/ca';
            Axios.get(uriCa).then((response) => {
                _this.isLoading = false;
                this.dataLich.caList = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            //get danh sach thú
            let uriLich = _this.url + '/api/thu';
            Axios.get(uriLich).then((response) => {
                _this.isLoading = false;
                this.dataLich.thuList = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            //get danh sách môn học
            let uriMonHoc = _this.url + '/api/mon-hoc';
            Axios.get(uriMonHoc, {
                headers: {
                    Authorization: 'Bearer' + ' ' + _this.token
                }
            }).then((response) => {
                _this.isLoading = false;
                this.dataLich.monList = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            // get danh sách tuần
            let uriTuan = _this.url + '/api/tuan';
            Axios.get(uriTuan).then((response) => {
                _this.isLoading = false;
                this.dataLich.tuanList = response.data.data;
                var year = new Date().getFullYear();
                var month = (new Date().getMonth() + 1);
                var date = new Date().getDate() ;
                var date = date.toString().length < 2 ? "0" + date : date;
                var currentDate = year + '-' + month + '-' + date
                var nextIndex = 0;
                for (var index in _this.dataLich.tuanList) {
                    let tuan = _this.dataLich.tuanList[index]
                    var ngaybatdau = tuan.ngay_bat_dau;
                    var ngayketthuc = tuan.ngay_ket_thuc;
                    if (ngaybatdau <= currentDate && currentDate <= ngayketthuc) {
                        _this.dataLich.curentTuan.push(this.dataLich.tuanList[index])
                        _this.dataLich.selectedTuan = tuan.id
                        nextIndex = parseInt(index) + 1
                        //_this.getDateOfWeek(this.dataLich.tuanList[index]);
                        break;
                    }

                }
                _this.dataLich.curentTuan.push(_this.dataLich.tuanList[nextIndex])

            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            // get danh sach hk
            let urihocKy = _this.url + '/api/hoc-ky';
            Axios.get(urihocKy).then((response) => {
                _this.isLoading = false;
                for (var hocky of response.data.data) {
                    let hockyItem = {
                        id: hocky.id,
                        tenhocky: hocky.name + ' - ' + hocky.nam_hoc,
                        ngaybatdau: hocky.ngay_bat_dau,
                        ngayketthuc: hocky.ngay_ket_thuc
                    }
                    _this.dataLich.hocKyList.push(hockyItem);
                }
                for (var hk of _this.dataLich.hocKyList) {
                    var ngaybatdau = hk.ngaybatdau;
                    var ngayketthuc = hk.ngayketthuc;
                    var year = new Date().getFullYear();
                    var month = (new Date().getMonth() + 1);
                    var date = new Date().getDate();
                    var currentDate = year + '-' + month + '-' + date
                    if (ngaybatdau <= currentDate && currentDate <= ngayketthuc) {
                        _this.dataLich.selectedHocKy = hk.id;
                        break
                    }
                }
            }).catch(error => {
                if (!error.response) {
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            //get danh sach phong may
            let uriPhongMay = _this.url + '/api/phong-may';
            Axios.get(uriPhongMay).then((response) => {
                _this.isLoading = false;
                this.dataLich.phongMayList = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });


        },
        methods: {
            changeRoute() {
                var _this = this;
                _this.hueky = true;
                var phong_may_id = _this.dataLich.selectedPhongMay.id
                Axios.get(_this.url + '/api/phong-may/'+ phong_may_id).then((response)=> {
                    _this.mota_pm = response.data.data;
                })
                //console.log(phong_may_id);
            },
            searchLichDay() {
                var _this = this;

                var data =
                    {
                        hk_id: typeof _this.dataLich.selectedHocKy == "object" ? _this.dataLich.selectedHocKy.id : _this.dataLich.selectedHocKy,
                        phong_may_id: _this.dataLich.selectedPhongMay,
                        tuan_id: typeof _this.dataLich.selectedTuan == "object" ? _this.dataLich.selectedTuan.id : _this.dataLich.selectedTuan,
                    }
                var ngayHienTai = _this.dataLich.tuanList.findIndex(itemTuan => itemTuan.id == data.tuan_id)
                _this.getDateOfWeek(this.dataLich.tuanList[ngayHienTai]);
                console.log(this.dataLich.tuanList[ngayHienTai]);
                Axios.get(_this.url + '/api/get-lich?' + 'hk_id=' + data.hk_id + '&phong_may_id=' + data.phong_may_id.id + '&tuan_id=' + data.tuan_id
                ).then((response) => {
                    _this.dataLich.lichDay = response.data.data
                    _this.dataLich.statusCode = response.status;
                }).catch(function (error) {
                    _this.error = error.response.data.message
                    _this.info = ""
                });
                Axios.get(_this.url + '/api/dk-muon-phong?' + 'hk_id=' + data.hk_id + '&phong_may_id=' + data.phong_may_id.id + '&tuan_id=' + data.tuan_id, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + _this.token
                    }
                }).then((response) => {
                    console.log(response.data.data.length > 0);
                    if (response.data.data.length > 0) {
                        for (let item of response.data.data) {
                            _this.dataLich.lichDay.push(item);
                        }
                    }
                    _this.selectTuan = data.tuan_id
                }).catch(function (error) {
                    _this.error = error.response.data.message
                    _this.info = ""
                });
            },
            viewMuonPhong(ca_id, thu_id, itemDetail) {
                var _this = this;
                _this.dataLich.ca_id = ca_id;
                _this.dataLich.thu_id = thu_id;
                var ngayHienTai = _this.dataLich.thuNgayList.findIndex(itemNgay => itemNgay.id == thu_id)
                _this.dataLich['ngay'] = _this.dataLich.thuNgayList[ngayHienTai].ngay
                console.log(_this.dataLich.thuNgayList[ngayHienTai]);

                if ((_this.dataLich.selectedTuan && _this.dataLich.selectedTuan && _this.dataLich.selectedTuan && _this.dataLich.statusCode == 200)) {
                    _this.dialogdkMuonPhong = true;
                    _this.detailMuonPhong = itemDetail
                } else {
                    _this.dialogdkMuonPhong = false;
                }
            },
            submitMuonPhong() {
                var _this = this
                var uri = _this.url + '/api/dk-muon-phong'
                var data =
                    {
                        mon_hoc_id: _this.dataLich.selectedMonHoc.id,
                        hk_id: typeof _this.dataLich.selectedHocKy == "object" ? _this.dataLich.selectedHocKy.id : _this.dataLich.selectedHocKy,
                        phong_may_id: _this.dataLich.selectedPhongMay.id,
                        ca_id: _this.dataLich.ca_id,
                        thu_id: _this.dataLich.thu_id,
                        ngay_muon: _this.dataLich.ngay,
                        tuan_id: typeof _this.dataLich.selectedTuan == "object" ? _this.dataLich.selectedTuan.id : _this.dataLich.selectedTuan,
                    }
                console.log(data);
                Axios.post(uri, data, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + _this.token
                    }
                }).then((response) => {
                    _this.dangKyMuonPhong.push(response.data.data)
                    _this.dialogdkMuonPhong = false
                }).catch(function (error) {
                    _this.error = error.response.data.message
                    _this.info = ""
                });
            },
            viewDetail(itemLichDay) {
                var _this = this;
                _this.dialog = true;
                _this.detailContent = itemLichDay;
            },
            checkLichTruc(ca_id, thu_id) {
                var _this = this;
                var dem = 0;
                var result = '';
                var lich_bu_thay_the = _this.muonPhong(ca_id, thu_id);
                if (lich_bu_thay_the) {
                    result = lich_bu_thay_the;
                } else {
                    for (var item of _this.dataLich.lichDay) {
                        if (item.ca_id == ca_id && item.thu_id == thu_id) {
                            dem++;
                            if (dem == 1) {
                                result = item;
                                break;
                            }
                        }
                    }
                }
                return result;
            },
            muonPhong(ca_id, thu_id) {
                var _this = this;
                var dem = 0;
                var resultMonHoc = '';
                for (var item of _this.dangKyMuonPhong) {
                    if (item.ca_id == ca_id && item.thu_id == thu_id) {
                        resultMonHoc = item;
                        break;

                    }
                }
                return resultMonHoc;
            },
            getDateOfWeek(curentTuan) {
                var _this = this;
                var dateOfWeek = new Date(curentTuan.ngay_bat_dau);
                var thuNgayItem = {id: 2, tenthu: _this.dataLich.thuList[0].name, ngay: curentTuan.ngay_bat_dau};
                _this.dataLich.thuNgayList.push(thuNgayItem);
                for (var i = 1; i <= 6; i++) {
                    dateOfWeek.setDate(dateOfWeek.getDate() + 1);
                    var dateText = dateOfWeek.getFullYear() + '-' + ('0' + (dateOfWeek.getMonth() + 1)).slice(-2) + '-' + ('0' + dateOfWeek.getDate()).slice(-2);
                    thuNgayItem = {id: 2 + i, tenthu: _this.dataLich.thuList[0 + i].name, ngay: dateText};
                    _this.dataLich.thuNgayList.push(thuNgayItem);
                }
            },
        },
    }
</script>

<style scoped>
    .lichtruc-box, .error-text {
        animation: displayLoading 0.5s;
    }

    .slt-hocky:focus {
        border: none;
    }

    .lichtruc-data, .row-thu, .lichtruc-content {
        display: flex;
    }

    .col-ca {
        width: 12.5%;
    }

    .col-thu {
        width: 87.5%;
    }

    .test {
        width: 300px;
    }

    .ca-content {
        border: 1px solid white;
        height: 150px;
        background-color: #2a4456;
        color: white;
    }

    .thu-content {
        width: 100%;
        height: 50px;
        display: flex;
    }

    .thu-content div {
        width: 14.28%;
        border: 1px solid white;
        height: 50px;
        background-color: #19b698;
        color: white;
        text-align: center;
        display: flex;
        flex-flow: wrap;
        justify-content: center;
        align-items: center;
        animation: displayLoading 0.25s;
    }

    .thu-content p {
        width: 100%;
        margin: 0;
    }

    .lichtruc-content-block {
        transition: all 0.25s;
        cursor: pointer;
    }

    .lichtruc-content-block:hover {
        opacity: 0.7;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .lichtruc-detail {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        flex-flow: wrap;
        height: 100%;
    }

    .lichtruc-detail > div {
        align-items: center;
        width: 100%;
    }

    .lichtruc-detail .btn-add {
        align-self: center;
    }

    .name-ktv {
        font-size: 14px;
    }

    @keyframes displayLoading {
        from {
            opacity: 0
        }
        to {
            opacity: 1
        }
    }

    @media screen and (max-width: 1280px) {
        .lichtruc-box {
            overflow-x: scroll;
        }

        .col-ca {
            min-width: 150px;
        }

        .col-thu {
            min-width: 1366px;
        }

        .card__title {
            min-width: 1516px;
        }
    }

</style>