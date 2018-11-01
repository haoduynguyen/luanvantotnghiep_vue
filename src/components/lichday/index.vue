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
            <v-btn class="btn-image" type="submit">submit</v-btn>
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
                    <div style="width: 14.28%;" v-for="thu in dataLich.thuList">
                        <div class="lichtruc-content-block" v-for="ca in dataLich.caList">
                            <div style="border: 1px solid white; height: 150px; background-color: #eeeeee">
                                <div class="lichtruc-detail"> {{ checkLichtruc(ca.id,thu.id) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>


</template>

<script>
    export default {
        name: "index",
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
            url: 'http://localhost:8000',

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
            searchLichDay() {
                var _this = this;
                var data =
                    {
                        hk_id: _this.dataLich.selectedHocKy,
                        phong_may_id: _this.dataLich.selectedPhongMay,
                        tuan_id: _this.dataLich.selectedTuan,
                    }
                Axios.get(_this.url + '/api/get-lich?' + 'hk_id=' + data.hk_id.id + '&phong_may_id=' + data.phong_may_id.id + '&tuan_id=' + data.tuan_id.id).then((response) => {
                    _this.dataLich.lichDay = response.data
                }).catch(function (error) {
                    _this.error = error.response.data.message
                    _this.info = ""
                });
            },
            checkLichtruc(ca_id, thu_id) {
                var _this = this;
                var dem = 0;
                var result = '';

                for (var item of _this.dataLich.lichDay) {

                    if (item.ca_id == ca_id && item.thu_id == thu_id) {
                        console.log(item);
                        result = item.user.profile.first_name + ' ' + item.user.profile.last_name;
                        break;
                    }
                }
                return result;
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