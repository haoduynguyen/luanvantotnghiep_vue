<template>
    <div>
        <v-form id="formData" v-on:submit.prevent="searchLichDay">
            <div style="display: flex">
                <v-select class="test"
                          :items="dataLich.tuanList"
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
                          return-object
                          persistent-hint
                ></v-select>

            </div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Submit</v-btn>
            </v-card-actions>
        </v-form>
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
                                <div v-if="checkLichTruc(ca.id,thu.id)==''" class="lichtruc-detail">
                                    <div></div>
                                </div>
                                <div v-else class="lichtruc-detail"
                                     v-on:click="viewDetail(ca.id,thu.id,checkLichTruc(ca.id, thu.id),key)">
                                    {{ checkLichTruc(ca.id, thu.id).user.profile.first_name+ ' ' + checkLichTruc(ca.id,
                                    thu.id).user.profile.last_name }}
                                    <div>{{ ( checkLichTruc(ca.id, thu.id).dang_ky_nghi != null && checkLichTruc(ca.id,
                                        thu.id).dang_ky_nghi.tuan_id == selectTuan) ? 'hôm nay nghỉ' : '' }}
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
                            <tr v-if="detailContent.nhom_lop">
                                <td><strong>Lớp: </strong></td>
                                <td>{{ detailContent.nhom_lop.name }}</td>
                            </tr>
                            <tr v-if="detailContent.ngay_muon">
                                <td><strong>Nội Dung: </strong></td>
                                <td>Phòng Mượn</td>
                            </tr>
                        </table>
                        <v-radio-group v-model="ex7" @change="changerdo" row>
                            <v-radio
                                    label="Bình Thường"
                                    color="indigo"
                                    value="3"
                            ></v-radio>
                            <v-radio
                                    label="Lỗi"
                                    color="red"
                                    value="1"
                            ></v-radio>
                        </v-radio-group>
                        <label style="color: red">{{error != '' ? error : ""}}</label>
                        <v-textarea v-if="ex7 == '1'"
                                    name="input-7-1"
                                    label="Mô Tả (*)"
                                    value=""
                                    v-model="moTaGv"
                                    hint="Hint text"
                                    style="width: 100%"
                                    required
                        ></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn type="submit"
                               v-if="(detailContent.dang_ky_nghi  == null &&
                               detailContent.nhom_lop || (detailContent.dang_ky_nghi  != null &&
                               detailContent.dang_ky_nghi.tuan_id != selectTuan )) &&
                                (detailContent.bao_cao_phong_may  == null
                                || (detailContent.bao_cao_phong_may  != null &&
                               detailContent.bao_cao_phong_may.tuan_id != selectTuan))"
                               v-on:click="dangKyNghi()">Đăng Ký Nghỉ
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" @click="submitMotaLoi()"
                               v-if="(detailContent.dang_ky_nghi  == null &&
                               detailContent.nhom_lop || (detailContent.dang_ky_nghi  != null &&
                               detailContent.dang_ky_nghi.tuan_id != selectTuan))&& (detailContent.bao_cao_phong_may  == null
                                || (detailContent.bao_cao_phong_may  != null &&
                               detailContent.bao_cao_phong_may.tuan_id != selectTuan)) ||
                               detailContent.ngay_muon != null">
                            Báo cáo phòng máy
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import url from '../../middleware/domain';
    export default {
        name: "indexFromGV",
        data: () => ({
            dataLich: {
                caList: "",
                thuList: "",
                lichDay: [],
                tuanList: [],
                hocKyList: [],
                phongMayList: [],
                selectedTuan: 0,
                selectedHocKy: 0,
                selectedPhongMay: 0,
                thuNgayList: [],
                mon_hoc_id: 0
            },
            dataDangKyNghi: {
                lich_day_id: 0,
                tuan_id: "",
            },
            selectTuan: 0,
            notification: '',
            statusNghi: 0,
            //url: 'https://luanvantn.dev.digiprojects.top',
            //url: 'http://localhost:8000',
            dialog: false,
            detailContent: "",
            id: 0,
            selectedNghi: 0,
            moTaGv: "",
            ex7: '3',
            error: '',
            success: '',
            info: '',
        }),
        created: function () {
            var _this = this;
            _this.isLoading = true;
            // get danh sách ca
            let uriCa = url.url + '/api/ca';
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
            let uriLich = url.url + '/api/thu';
            Axios.get(uriLich).then((response) => {
                _this.isLoading = false;
                this.dataLich.thuList = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            // get danh sách tuần
            let uriTuan = url.url + '/api/tuan';
            Axios.get(uriTuan).then((response) => {
                _this.isLoading = false;
                this.dataLich.tuanList = response.data.data;
                var year = new Date().getFullYear();
                var month = (new Date().getMonth() + 1);
                var date = new Date().getDate();
                var date = date.toString().length < 2 ? "0" + date : date;
                var month = month.toString().length < 2 ? "0" + month : month;
                var currentDate = year + '-' + month + '-' + date
                for (var tuan of _this.dataLich.tuanList) {
                    var ngaybatdau = tuan.ngay_bat_dau;
                    var ngayketthuc = tuan.ngay_ket_thuc;
                    if (ngaybatdau <= currentDate && currentDate <= ngayketthuc) {
                        _this.dataLich.selectedTuan = tuan.id;
                        break;
                    }
                }
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            // get danh sach hk
            let urihocKy = url.url + '/api/hoc-ky';
            Axios.get(urihocKy).then((response) => {
                _this.isLoading = false;
                for (var hocky of response.data.data) {
                    let hockyItem = {
                        id: hocky.id,
                        tenhocky: hocky.name + ' - ' + hocky.nam_hoc,
                        ngaybatdau: hocky.ngay_bat_dau,
                        ngayketthuc: hocky.ngay_ket_thuc
                    };
                    _this.dataLich.hocKyList.push(hockyItem);
                }
                for (var hk of _this.dataLich.hocKyList) {
                    var ngaybatdau = hk.ngaybatdau;
                    var ngayketthuc = hk.ngayketthuc;
                    var year = new Date().getFullYear();
                    var month = (new Date().getMonth() + 1);
                    var date = new Date().getDate();
                    var date = date.toString().length < 2 ? "0" + date : date;
                    var month = month.toString().length < 2 ? "0" + month : month;
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
            let uriPhongMay = url.url + '/api/phong-may';
            Axios.get(uriPhongMay).then((response) => {
                _this.isLoading = false;
                _this.dataLich.phongMayList = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            let author = localStorage.getItem('author');
            let Auth = JSON.parse(author);
            _this.id = Auth['id'];
            _this.token = Auth['token'];
        },
        methods: {
            searchLichDay() {
                var _this = this;
                var data =
                    {
                        hk_id: typeof _this.dataLich.selectedHocKy == "object" ? _this.dataLich.selectedHocKy.id : _this.dataLich.selectedHocKy,
                        phong_may_id: _this.dataLich.selectedPhongMay,
                        tuan_id: typeof _this.dataLich.selectedTuan == "object" ? _this.dataLich.selectedTuan.id : _this.dataLich.selectedTuan,

                    }
                var ngayHienTai = _this.dataLich.tuanList.findIndex(itemTuan => itemTuan.id == data.tuan_id)
                _this.dataLich.thuNgayList = []
                _this.getDateOfWeek(_this.dataLich.tuanList[ngayHienTai]);
                Axios.get(url.url + '/api/get-lich-gv?' + 'hk_id=' + data.hk_id + '&phong_may_id=' + data.phong_may_id.id + '&tuan_id=' + data.tuan_id
                    , {
                        headers: {
                            Authorization: 'Bearer' + ' ' + this.token
                        }
                    }).then((response) => {
                    _this.dataLich.lichDay = [];
                    _this.dataLich.lichDay = response.data.data;
                    _this.selectTuan = data.tuan_id
                }).catch(function (e) {
                    _this.info = e.response.data.message

                });
                Axios.get(url.url + '/api/get-dk-muon-phong-gv?' + 'hk_id=' + data.hk_id + '&phong_may_id=' + data.phong_may_id.id + '&tuan_id=' + data.tuan_id
                    , {
                        headers: {
                            Authorization: 'Bearer' + ' ' + this.token
                        }
                    }).then((response) => {
                    for (let item of response.data.data) {
                        _this.dataLich.lichDay.push(item);
                    }
                    _this.success = 'Thành Công';
                    setTimeout(() => {
                        _this.success = '';
                    }, 3000);
                    _this.selectTuan = data.tuan_id
                }).catch(function (error) {
                    _this.info = error.response.data.message;
                    setTimeout(() => {
                        _this.info = '';
                    }, 3000);
                });
            },
            dangKyNghi() {
                var _this = this;
                var uri = url.url + '/api/dang-ky-nghi'
                var timeDKN = new Date().getHours() + ":" + new Date().getMinutes();
                var data =
                    {
                        lich_day_id: _this.selectedNghi,  //_this.dataDangKyNghi.lich_day_id,
                        tuan_id: typeof _this.dataLich.selectedTuan == "object" ? _this.dataLich.selectedTuan.id : _this.dataLich.selectedTuan,
                        ngay_nghi: _this.dataLich.ngay,
                        timeDKN: timeDKN,
                    }
                Axios.post(uri, data, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + _this.token
                    }
                }).then((response) => {
                    if (response.status == 200) {
                        _this.success = 'Đăng Ký Nghỉ Thành Công';
                        setTimeout(() => {
                            _this.success = '';
                        }, 3000);
                        _this.notification = 'hôm nay nghỉ';
                        for (let item of response.data.data) {
                            var indexLichday = _this.dataLich.lichDay.findIndex(itemLichday => itemLichday.id == item.lich_day_id)
                            _this.dataLich.lichDay[indexLichday].dang_ky_nghi = {tuan_id: _this.selectTuan}
                        }
                        _this.dialog = false
                        //Bat theo front-end
                        // if(indexLichday + 1 <= _this.dataLich.lichDay.length - 1 && _this.dataLich.lichDay[indexLichday + 1].id -_this.dataLich.lichDay[indexLichday].id == 1
                        //     && _this.dataLich.lichDay[indexLichday + 1].nhom_lop_id ==  _this.dataLich.lichDay[indexLichday].nhom_lop_id)
                        //     _this.dataLich.lichDay[indexLichday + 1].dang_ky_nghi = {status: 1}
                        // if(indexLichday - 1 >= 0 && _this.dataLich.lichDay[indexLichday].id -_this.dataLich.lichDay[indexLichday - 1].id == 1
                        //     &&_this.dataLich.lichDay[indexLichday - 1].nhom_lop_id ==  _this.dataLich.lichDay[indexLichday].nhom_lop_id)
                        //     _this.dataLich.lichDay[indexLichday - 1].dang_ky_nghi = {status: 1}
                        // console.log(response);
                    }
                }).catch(function (error) {
                    console.log('aaa');
                    _this.info = error.response.data.message
                    console.log(_this.info);
                    setTimeout(() => {
                        _this.info = '';
                    }, 3000);
                    _this.dialog = false
                });
            },
            viewDetail(ca_id, thu_id, itemLichDay) {
                var _this = this;
                _this.dialog = true;
                _this.selectedNghi = itemLichDay.id
                _this.dataLich.ca_id = ca_id;
                _this.dataLich.thu_id = thu_id;
                _this.dataLich.mon_hoc_id = itemLichDay.mon_hoc_id
                _this.detailContent = itemLichDay;// ham nay ko chay thi pai
                var ngayHienTai = _this.dataLich.thuNgayList.findIndex(itemNgay => itemNgay.id == itemLichDay.thu_id)
                _this.dataLich['ngay'] = _this.dataLich.thuNgayList[ngayHienTai].ngay
            },
            checkLichTruc(ca_id, thu_id) {
                var _this = this;
                var dem = 0;
                var result = '';
                var status = 0;
                for (var item of _this.dataLich.lichDay) {
                    if (item.ca_id == ca_id && item.thu_id == thu_id) {
                        dem++;
                        if (dem == 1) {
                            result = item;
                            //_this.dataDangKyNghi.lich_day_id = item.id;

                            //console.log(item);

                            if (item.dang_ky_nghi != null) {
                                status = item.dang_ky_nghi.tuan_id
                            }
                            break;
                        }
                    }
                }
                return result;
            },
            submitMotaLoi() {
                var _this = this;
                var uri = url.url + '/api/add-mo-ta'
                var data =
                    {
                        mota_gv: _this.moTaGv,
                        phong_may_id: _this.dataLich.selectedPhongMay.id,
                        ca_id: _this.dataLich.ca_id,
                        mon_hoc_id: _this.dataLich.mon_hoc_id,
                        status: _this.ex7,
                        ngay_thong_bao: _this.dataLich.ngay,
                        tuan_id: typeof _this.dataLich.selectedTuan == "object" ? _this.dataLich.selectedTuan.id : _this.dataLich.selectedTuan,
                        lich_day_id: _this.selectedNghi,
                        thu_id: _this.dataLich.thu_id,
                    }
                Axios.post(uri, data, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + this.token
                    }
                }).then((response) => {
                    if (response.status == 201) {
                        _this.dialog = false
                        _this.moTaGv = "";
                        _this.success = 'Báo lỗi phòng máy thành công!'
                        setTimeout(() => {
                            _this.success = '';
                        }, 3000);
                            var indexLichday = _this.dataLich.lichDay.findIndex(itemLichday => itemLichday.id == response.data.data.lich_day_id)
                            _this.dataLich.lichDay[indexLichday].bao_cao_phong_may = {tuan_id: _this.selectTuan}

                        }

                }).catch(function (error) {
                    //_this.error = error.response.data.message;
                    _this.info = ""
                });
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
            changerdo() {
                let _this = this
                console.log(_this.ex7);
                if (_this.ex7 == '1') {
                    console.log('aaa');
                }
            }
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

    .rdobtn {

    }

    @keyframes displayLoading {
        from {
            opacity: 0
        }
        to {
            opacity: 1
        }
    }

    .alert-effect {
        animation: animations 1s;
        position: absolute;
        top: 65px;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
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

    @keyframes animations {
        from {
            top: -20px
        }
        to {
            top: 65px
        }
    }


</style>