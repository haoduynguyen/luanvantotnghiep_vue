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
                                <div v-if="checkLichTruc(ca.id,thu.id)==''" class="lichtruc-detail">
                                    <div></div>
                                </div>
                                <div v-else class="lichtruc-detail"
                                     v-on:click="viewDetail(checkLichTruc(ca.id, thu.id),key)">
                                    {{ checkLichTruc(ca.id, thu.id).user.profile.first_name+ ' ' + checkLichTruc(ca.id,
                                    thu.id).user.profile.last_name }}
                                    <div>{{ ( checkLichTruc(ca.id, thu.id).dang_ky_nghi != null  && checkLichTruc(ca.id, thu.id).dang_ky_nghi.tuan_id == selectTuan) ? 'hôm nay nghỉ' : ''  }}
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
                            <tr>
                                <td><strong>Lớp: </strong></td>
                                <td>{{ detailContent.nhom_lop.name }}</td>
                            </tr>
                        </table>
                        <v-textarea
                                name="input-7-1"
                                label="Mô Tả"
                                value=""
                                v-model="moTaGv"
                                hint="Hint text"
                                style="width: 100%"
                        ></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn type="submit"
                               v-if="detailContent.dang_ky_nghi == null "
                               v-on:click="dangKyNghi()">Đăng Ký Nghỉ
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" @click="submitMotaLoi()">Báo cáo phòng máy</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
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
            },
            dataDangKyNghi: {
                lich_day_id: 0,
                tuan_id: 0,
            },
            selectTuan:0,
            notification: '',
            statusNghi: 0,
            url: 'http://luanvantn.dev.digiprojects.top',
            dialog: false,
            detailContent: "",
            id: 0,
            selectedNghi: 0,
            moTaGv: ""
        }),
        created: function () {
            var _this = this;
            _this.isLoading = true;
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
                    // network error
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
                var date = new Date().getDate();
                var currentDate = year + '-' + month + '-'+ date
                for(var tuan of _this.dataLich.tuanList) {
                    var ngaybatdau = tuan.ngay_bat_dau;
                    var ngayketthuc =tuan.ngay_ket_thuc;
                    if(ngaybatdau <= currentDate && currentDate <= ngayketthuc) {
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
                for(var hk of _this.dataLich.hocKyList)
                {
                    var ngaybatdau = hk.ngaybatdau;
                    var ngayketthuc =hk.ngayketthuc;
                    var year = new Date().getFullYear();
                    var month = (new Date().getMonth() + 1);
                    var date = new Date().getDate();
                    var currentDate = year + '-' + month + '-'+ date

                    if(ngaybatdau <= currentDate && currentDate <= ngayketthuc) {
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
            let author = localStorage.getItem('author')
            let Auth = JSON.parse(author);
            this.id = Auth['id'];
            this.token = Auth['token'];
        },
        methods: {
            searchLichDay() {
                var _this = this;
                var data =
                    {
                        hk_id: typeof _this.dataLich.selectedHocKy == "object" ?_this.dataLich.selectedHocKy.id:_this.dataLich.selectedHocKy,
                        phong_may_id: _this.dataLich.selectedPhongMay,
                        tuan_id: typeof _this.dataLich.selectedTuan == "object" ? _this.dataLich.selectedTuan.id :_this.dataLich.selectedTuan,
                    }
                Axios.get(_this.url + '/api/get-lich-gv?' + 'hk_id=' + data.hk_id + '&phong_may_id=' + data.phong_may_id.id + '&tuan_id=' + data.tuan_id
                    , {
                        headers: {
                            Authorization: 'Bearer' + ' ' + this.token
                        }
                    }).then((response) => {
                    _this.dataLich.lichDay = response.data.data;
                    _this.selectTuan =  data.tuan_id
                    console.log(_this.selectTuan);
                }).catch(function (error) {
                    _this.error = error.response.data.message
                    _this.info = ""
                });
            },
            dangKyNghi() {
                var _this = this;
                var uri = _this.url + '/api/dang-ky-nghi'
                var data =
                    {
                        lich_day_id: _this.selectedNghi,  //_this.dataDangKyNghi.lich_day_id,
                        tuan_id:  typeof _this.dataLich.selectedTuan == "object" ? _this.dataLich.selectedTuan.id :_this.dataLich.selectedTuan,
                    }
                console.log(data);
                // console.log(_this.dataLich.lichDay)

                Axios.post(uri, data, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + this.token
                    }
                }).then((response) => {

                    if (response.status == 200) {
                        alert('thong bao nghi thanh cong')
                        _this.notification = 'hôm nay nghỉ'

                        //console.log(_this.dataLich.lichDay[indexLichday])
                        console.log(response.data.data);
                        for (let item of response.data.data) {
                            console.log(item);
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
                    _this.error = error.response.message
                    _this.info = ""
                });
            },
            viewDetail(itemLichDay) {
                var _this = this;
                _this.dialog = true;
                _this.selectedNghi = itemLichDay.id
                _this.detailContent = itemLichDay;// ham nay ko chay thi pai
                console.log(_this.detailContent);
            },
            checkLichTruc(ca_id, thu_id) {
                var _this = this;
                var dem = 0;
                var result = '';
                var status = 0;
                for (var item of _this.dataLich.lichDay) {
                    if (item.ca_id == ca_id && item.thu_id == thu_id ) {
                        dem++;
                        if (dem == 1) {
                            result = item;
                            _this.dataDangKyNghi.lich_day_id = item.id;
                            if (item.dang_ky_nghi != null) {
                                status = item.dang_ky_nghi.status
                            }
                            break;
                        }

                    }
                }
                return result;
            },
            submitMotaLoi() {
                var _this = this;
                var uri = _this.url + '/api/add-mo-ta'
                var data =
                    {
                        mota_gv: _this.moTaGv,
                        phong_may_id: _this.dataLich.selectedPhongMay.id,
                    }
                Axios.post(uri, data, {
                    headers: {
                        Authorization: 'Bearer' + ' ' + this.token
                    }
                }).then((response) => {

                    if (response.status == 201) {
                        _this.dialog = false
                        alert('Báo lỗi phòng mày thành công')
                    }
                }).catch(function (error) {
                    _this.error = error.response.data.message
                    _this.info = ""
                });
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