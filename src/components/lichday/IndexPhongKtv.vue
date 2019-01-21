<template>
    <div>
        <v-form id="formData" v-on:submit.prevent="searchLichDay">
            <div style="display: flex; ">
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

            </div>
            <v-card-actions>
                <v-btn v-bind:to="{name: 'importLichDay'}">Import</v-btn>
                <v-spacer></v-spacer>
                <label>
                    <input type="text" name="color1" style="background-color: 	#b26b66; width: 20px" disabled> Đã có
                    giảng viên dạy <br>
                    <input type="text" name="color1" style="background-color: 	#5b7bb4; width: 20px" disabled> Chưa có
                    Lịch Dạy
                    <input type="text" name="color1" style="background-color: red; width: 20px; margin-left: 13px"
                           disabled> Đang mượn phòng
                </label>
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
                    <div v-for="( thu, key ) in dataLich.thuList" :key="key"
                         style="width: 14.28%; background-color: #4267b2">
                        <div v-for="( ca, key ) in dataLich.caList" :key="key" class="lichtruc-content-block">
                            <div v-for="(phongMay,key) in dataLich.phongMayList" :key="key"
                                 class="phongmay-content-block">
                                <div style="border: 1px solid white; height: 50px; background-color: #5b7bb4">
                                    <div v-if="checkLichMuonPhong(ca.id,thu.id,phongMay.id)"
                                         class="lichtruc-detail"
                                         v-on:click="viewDaMuonPhong(ca.id, thu.id,phongMay,checkLichMuonPhong(ca.id,thu.id,phongMay.id))"
                                         style="background-color: red; width: 100%;height: 100%; z-index: 99">
                                        {{phongMay.name}}
                                    </div>
                                    <div v-else-if="(checkLichTruc(ca.id,thu.id,phongMay.id)=='' ||
                                    ( checkLichTruc(ca.id,thu.id,phongMay.id).dang_ky_nghi != null &&
                                    checkLichTruc(ca.id,thu.id,phongMay.id).dang_ky_nghi.tuan_id == selectTuan))"
                                         class="lichtruc-detail">{{phongMay.name}}
                                    </div>
                                    <div v-else class="lichtruc-detail"
                                         v-on:click="viewDetail(checkLichTruc(ca.id, thu.id,phongMay.id))">
                                        <div style="background-color:	#b26b66;" class="lichtruc-detail">
                                            {{checkLichTruc(ca.id,thu.id,phongMay.id).phong_may.name}}
                                        </div>
                                        <div></div>
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
                                <td><strong>Giảng Viên:</strong></td>
                                <td>{{ detailContent.user.profile.first_name + ' ' +
                                    detailContent.user.profile.last_name
                                    }}
                                </td>
                            </tr>
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
            <v-dialog v-model="dialogDaMuonPhong" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Lịch chi tiết</span>
                    </v-card-title>
                    <v-card-text v-if="detailDaMuonPhong">
                        <table style="width: 100%" class="table-view-detail">
                            <tr>
                                <td><strong>Giảng Viên:</strong></td>
                                <td>{{ detailDaMuonPhong.user.profile.first_name + ' ' +
                                    detailDaMuonPhong.user.profile.last_name
                                    }}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Phòng máy:</strong></td>
                                <td>{{ detailDaMuonPhong.phong_may.name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Ca: </strong></td>
                                <td>{{ detailDaMuonPhong.ca.name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Thứ: </strong></td>
                                <td>{{ detailDaMuonPhong.thu.name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Môn học: </strong></td>
                                <td>{{ detailDaMuonPhong.mon_hoc.name }}</td>
                            </tr>
                            <tr v-if=" detailDaMuonPhong.nhom_lop">
                                <td><strong>Lớp: </strong></td>
                                <td>{{ detailDaMuonPhong.nhom_lop.name }}</td>
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
                        <span class="headline"
                              style="color: tomato">Đăng Ký Mượn Phòng - {{detailContentMota.name}}</span>
                        <v-spacer></v-spacer>
                        <div>
                            <label v-if="detailContentMota">Số máy: {{detailContentMota.so_may}}</label>
                            <v-spacer></v-spacer>
                            <label v-if="detailContentMota">Mô tả: {{detailContentMota.mo_ta}}</label>
                        </div>
                        <div style="width: 100%">
                            <v-select class="test"
                                      :items="dataLich.monList"
                                      v-model="dataLich.selectedMonHoc"
                                      @change="onChangeMonhoc(dataLich.selectedMonHoc)"
                                      label="Môn Học"
                                      single-line
                                      item-text="name"
                                      item-value="id"
                                      return-object
                                      persistent-hint
                                      style="width: 100%"
                            ></v-select>
                        </div>
                        <div style="width: 100%">
                            <v-text-field
                                    v-if="showGhichu"
                                    v-model="ghichu"
                                    label="Ghi chú"
                                    required
                                    style="width: 100%"
                            ></v-text-field>
                        </div>
                    </v-card-title>
                    <v-card-text v-if="detailMuonPhong && dangKyMuonPhong">
                        <table style="width: 100%" class="table-view-detail">
                            <tr>
                                <td><strong>Giảng Viên:</strong></td>
                                <td>{{ dangKyMuonPhong.user.profile.first_name + ' ' +
                                    dangKyMuonPhong.user.profile.last_name }}
                                </td>
                            </tr>
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
    import url from '../../middleware/domain';
    export default {
        name: "IndexPhongKtv",
        data: () => ({
            dataLich: {
                caList: "",
                thuList: "",
                monList: [],
                lichDay: [],
                lichMuon: [],
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
                phong_id: 0,
                thuNgayList: [],
            },
            mota_pm: '',
            selectTuan: 0,
            //url: 'https://luanvantn.dev.digiprojects.top',
            //url: 'http://localhost:8000',
            dialog: false,
            dialogdkMuonPhong: false,
            dialogDaMuonPhong:false,
            hueky: false,
            detailContent: "",
            detailContentMota: "",
            dangKyMuonPhong: "",
            detailMuonPhong: "",
            detailDaMuonPhong: "",
            token: "",
            ghichu: '',
            showGhichu: false
        }),
        created: function () {
            var _this = this;
            _this.isLoading = true;
            let author = localStorage.getItem('author')
            let Auth = JSON.parse(author);
            _this.id = Auth['id'];
            _this.token = Auth['token'];
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
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            //get danh sách môn học
            let uriMonHoc = url.url + '/api/mon-hoc';
            Axios.get(uriMonHoc, {
                headers: {
                    Authorization: 'Bearer' + ' ' + _this.token
                }
            }).then((response) => {
                _this.isLoading = false;
                this.dataLich.monList = response.data.data;
                this.dataLich.monList.push({id: 100, name: 'Môn khác'})
            }).catch(error => {
                if (!error.response) {
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
                    }
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
                this.dataLich.phongMayList = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    _this.errorStatus = 'Error: Network Error';
                } else {
                    _this.errorStatus = error.response.data.message;
                    alert(_this.errorStatus);
                }
            });


        },
        methods: {
            // changeRoute() {
            //     var _this = this;
            //     _this.hueky = true;
            //     var phong_may_id = _this.dataLich.selectedPhongMay.id
            //     Axios.get(_this.url + '/api/phong-may/' + phong_may_id).then((response) => {
            //         _this.mota_pm = response.data.data;
            //     })
            //     //console.log(phong_may_id);
            // },

            searchLichDay() {
                var _this = this;
                var data =
                    {
                        hk_id: typeof _this.dataLich.selectedHocKy == "object" ? _this.dataLich.selectedHocKy.id : _this.dataLich.selectedHocKy,
                        tuan_id: typeof _this.dataLich.selectedTuan == "object" ? _this.dataLich.selectedTuan.id : _this.dataLich.selectedTuan,
                    }
                var ngayHienTai = _this.dataLich.tuanList.findIndex(itemTuan => itemTuan.id == data.tuan_id)
                _this.dataLich.thuNgayList = []
                _this.getDateOfWeek(this.dataLich.tuanList[ngayHienTai]);
                Axios.get(url.url + '/api/get-lich?' + 'hk_id=' + data.hk_id + '&tuan_id=' + data.tuan_id
                ).then((response) => {
                    _this.dataLich.lichDay = response.data.data
                    _this.dataLich.statusCode = response.status;
                }).catch(function (error) {
                    _this.error = error.response.data.message
                    _this.info = ""
                });
                Axios.get(url.url + '/api/dk-muon-phong?' + 'hk_id=' + data.hk_id + '&tuan_id=' + data.tuan_id, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + _this.token
                    }
                }).then((response) => {
                    _this.dataLich.lichMuon = response.data.data;
                    _this.selectTuan = data.tuan_id
                }).catch(function (error) {
                    _this.error = error.response.data.message
                    _this.info = ""
                });
            },
            viewMuonPhong(ca_id, thu_id, phong_id, itemDetail) {
                var _this = this;
                _this.dataLich.ca_id = ca_id;
                _this.dataLich.thu_id = thu_id;
                _this.dataLich.phong_id = phong_id.id;
                var ngayHienTai = _this.dataLich.thuNgayList.findIndex(itemNgay => itemNgay.id == thu_id)
                _this.dataLich['ngay'] = _this.dataLich.thuNgayList[ngayHienTai].ngay
                if ((_this.dataLich.selectedTuan && _this.dataLich.selectedTuan && _this.dataLich.selectedTuan && _this.dataLich.statusCode == 200)) {
                    _this.dialogdkMuonPhong = true;
                    _this.detailMuonPhong = itemDetail
                    _this.detailContentMota = phong_id;
                } else {
                    _this.dialogdkMuonPhong = false;
                }
            },
            viewDaMuonPhong(ca_id, thu_id, phong_id, itemDetail) {
                var _this = this;
                _this.dataLich.ca_id = ca_id;
                _this.dataLich.thu_id = thu_id;
                _this.dataLich.phong_id = phong_id.id;
                if ((_this.dataLich.selectedTuan && _this.dataLich.selectedTuan && _this.dataLich.selectedTuan && _this.dataLich.statusCode == 200)) {
                    _this.dialogDaMuonPhong = true;
                    _this.detailDaMuonPhong = itemDetail
                } else {
                    _this.dialogdkMuonPhong = false;
                }
            },
            submitMuonPhong() {
                var _this = this
                var uri = url.url + '/api/dk-muon-phong'
                var data =
                    {
                        mon_hoc_id: _this.dataLich.selectedMonHoc.id,
                        hk_id: typeof _this.dataLich.selectedHocKy == "object" ? _this.dataLich.selectedHocKy.id : _this.dataLich.selectedHocKy,
                        phong_may_id: _this.dataLich.phong_id,
                        ca_id: _this.dataLich.ca_id,
                        thu_id: _this.dataLich.thu_id,
                        ngay_muon: _this.dataLich.ngay,
                        tuan_id: typeof _this.dataLich.selectedTuan == "object" ? _this.dataLich.selectedTuan.id : _this.dataLich.selectedTuan,
                    }
                Axios.post(uri, data, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + _this.token
                    }
                }).then((response) => {
                    _this.dangKyMuonPhong = response.data.data
                    alert('đăng ký phòng thành công')
                    _this.dialogdkMuonPhong = false
                    let resultData = response.data.data
                    _this.dataLich.lichMuon.push(resultData)
                }).catch(function (error) {
                    _this.error = error.response.data.message
                    alert(_this.error);
                    _this.info = ""
                });
            },
            viewDetail(itemLichDay) {
                var _this = this;
                _this.dialog = true;
                _this.detailContent = itemLichDay;
            },
            checkLichMuonPhong(ca_id, thu_id, phongMay_id) {
                var _this = this;
                var result = '';
                for (var item of _this.dataLich.lichMuon) {
                    if (item.ca_id == ca_id && item.thu_id == thu_id && item.phong_may_id == phongMay_id) {
                        result = item;
                        break;
                    }
                }
                return result;
            },
            checkLichTruc(ca_id, thu_id, phongMay_id) {
                var _this = this;
                var dem = 0;
                var result = '';
                // var lich_bu_thay_the = _this.muonPhong(ca_id, thu_id, phongMay_id);
                // if (lich_bu_thay_the) {
                //     result = lich_bu_thay_the;
                // } else {
                for (var item of _this.dataLich.lichDay) {
                    if (item.ca_id == ca_id && item.thu_id == thu_id && item.phong_may_id == phongMay_id) {
                        dem++;
                        if (dem == 1) {
                            result = item;
                            break;
                        }
                    }
                }
                //}
                return result;
            },
            muonPhong(ca_id, thu_id, phongmay_id) {
                var _this = this;
                var dem = 0;
                var resultMonHoc = '';
                for (var item of _this.dangKyMuonPhong) {
                    if (item.ca_id == ca_id && item.thu_id == thu_id && item.phong_may_id == phongmay_id) {
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
            onChangeMonhoc(monhoc) {
                this.showGhichu = false
                if (monhoc.name == 'Môn khác')
                    this.showGhichu = true
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
        display: flex;
        flex-flow: wrap;
    }

    /*.lichtruc-content-block:hover {*/
    /*opacity: 0.7;*/
    /*box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);*/
    /*}*/
    .phongmay-content-block {
        width: 33.33%;
        height: 50px;
    }

    .phongmay-content-block:hover {
        opacity: 0.7;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .lichtruc-detail {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
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