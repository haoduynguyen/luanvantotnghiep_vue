<template>
    <div>
        <v-layout wrap align-center>
            <v-flex xs12 sm4 d-flex>
                <v-select class="test"
                          :items="listPhongMay"
                          v-model="selectedPhongMay"
                          label="Phòng Máy"
                          single-line
                          item-text="name"
                          item-value="id"
                          return-object
                          persistent-hint
                ></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm4 d-flex>
                <v-select class="test"
                          :items="tuanList"
                          v-model="selectedTuan"
                          label="Tuần"
                          single-line
                          item-text="tenTuan"
                          item-value="id"
                          return-object
                          persistent-hint
                ></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-btn @click="exportFile" class="btn btn-xs btn-success" color="primary">Export</v-btn>
        </v-layout>
        <v-card>
            <v-card-title>
                <div class="fillter" style="width: 200px">
                    <v-checkbox class="filter-chk" :label="`Chưa Sửa`" value="1" v-model="check_box_chua_sua"
                                @change="changeCheckbox"></v-checkbox>
                    <v-checkbox class="filter-chk" :label="`Đang Sửa`" value="2" v-model="check_box_dang_sua"
                                @change="changeCheckbox"></v-checkbox>
                    <v-checkbox class="filter-chk" :label="`Đã Sửa (Bình Thường)`" value="3" v-model="check_box_da_sua"
                                @change="changeCheckbox"></v-checkbox>
                </div>
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                        style="margin-bottom: 18px"
                ></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="listMota"
                    :pagination.sync="pagination"
                    select-all
                    item-key="name"
                    class="elevation-1"
                    :search="search"
            >
                <template slot="headers" slot-scope="props">
                    <tr>
                        <th
                                v-for="header in props.headers"
                                :key="header.text"
                                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                @click="changeSort(header.value)"
                        >
                            <v-icon small>arrow_upward</v-icon>
                            {{ header.text }}
                        </th>
                    </tr>
                </template>
                <template slot="items" slot-scope="props">
                    <tr>
                        <td class="text-xs-center">{{ props.item.phong_may.name}}</td>
                        <td class="text-xs-center">{{ props.item.giang_vien.profile.first_name + ' ' +
                            props.item.giang_vien.profile.last_name
                            }}
                        </td>
                        <td class="text-xs-center">{{ props.item.mota_gv != null ? props.item.mota_gv : "" }}</td>
                        <td class="text-xs-center">{{ props.item.ky_thuat_vien != null ?
                            props.item.ky_thuat_vien.profile.first_name + ' ' +
                            props.item.ky_thuat_vien.profile.last_name : "" }}
                        </td>
                        <td class="text-xs-center" v-if="props.item.status == 1">Chưa Sửa</td>
                        <td class="text-xs-center" v-if="props.item.status == 2">Đang Sửa</td>
                        <td class="text-xs-center" v-if="props.item.status == 3">Bình Thường</td>
                        <td class="text-xs-center">{{ props.item.ngay_tao != null ? props.item.ngay_tao : "" }}</td>
                        <td class="text-xs-center">{{ (props.item.status == 3 && props.item.ngay_sua != null) ?
                            props.item.ngay_sua : "-" }}
                        </td>

                        <td class="text-xs-center">
                            <v-btn v-if="user_role != 3" icon class="mx-0" @click="editItem(props.item.id)">
                                <v-icon color="teal">edit</v-icon>
                            </v-btn>
                            <v-btn icon class="mx-0" @click="xacnhanxoa(props.item.id,props.index)">
                                <v-icon color="pink">delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
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
        <v-layout row justify-center>
            <v-dialog
                    v-model="dialogDelete"
                    max-width="290"
            >
                <v-card>
                    <v-card-title class="headline">Bạn có chắc chắn muốn xóa không ?</v-card-title>

                    <v-card-text>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="green darken-1"
                                flat="flat"
                                @click="dialogDelete = false"
                        >
                            Không
                        </v-btn>
                        <v-btn
                                color="green darken-1"
                                flat="flat"
                                @click="xoaData"
                        >
                            Đồng ý
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>
<script>
    export default {
        name: "listMayLoi",
        data: () => ({
            pagination: {
                sortBy: 'name'
            },
            selected: [],
            search: "",
            headers: [
                {text: 'Phòng Máy', value: 'phong_may.name', align: 'left',},
                {
                    text: 'Tên Giảng Viên',
                    align: 'left',
                    value: 'giang_vien.profile.first_name'
                },
                {text: 'Mô Tả Giảng Viên', value: '', align: 'left',},
                {text: 'Tên Kỹ Thuật Viên', value: '', align: 'left',},
                {text: 'Mô Tả Kỹ Thuật Viên', value: '', align: 'left',},
                {text: 'Ngày Tạo', value: '', align: 'left',},
                {text: 'Ngày Sửa', value: '', align: 'left',},
                {text: 'Chức Năng', value: '', align: 'left',},
            ],
            listMota: [],
            //url: 'https://luanvantn.dev.digiprojects.top',
            url: 'http://localhost:8000',
            urlExport: '',
            listPhongMay: [],
            selectedPhongMay: 0,
            selectedTuan: 0,
            check_box_chua_sua: 0,
            check_box_dang_sua: 0,
            check_box_da_sua: 0,
            user_role: 0,
            tuanList: [],
            success: '',
            info: '',
            valueItem: '',
            positionItem: '',
            dialogDelete: false,
        }),
        created: function () {
            var _this = this;
            let author = localStorage.getItem('author');
            let auth = JSON.parse(author);
            _this.token = auth['token'];
            _this.user_role = auth['role_id'];
            _this.isLoading = true;
            let uri = _this.url + '/api/list-mo-ta';
            Axios.get(uri, {
                headers: {
                    Authorization: 'Bearer' + ' ' + _this.token
                }
            }).then((response) => {
                _this.isLoading = false;
                _this.listMota = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
            let uriPhongMay = _this.url + '/api/phong-may';
            Axios.get(uriPhongMay).then((response) => {
                _this.isLoading = false;
                _this.listPhongMay = response.data.data;
                _this.listPhongMay.push({name: 'Không Chọn'})
            }).catch(error => {
                if (!error.response) {
                    _this.errorStatus = 'Error: Network Error';
                } else {
                    _this.errorStatus = error.response.data.message;
                    alert(_this.errorStatus);
                }
            });
            // get danh sách tuần
            let uriTuan = _this.url + '/api/tuan';
            Axios.get(uriTuan).then((response) => {
                _this.isLoading = false;
                for (let item of response.data.data) {
                    let tuanItem = {
                        id: item.id,
                        tenTuan: item.description + ' ' + '(' + 'Từ ' + item.ngay_bat_dau + ' Đến ' + item.ngay_ket_thuc + ')'
                    }
                    _this.tuanList.push(tuanItem);
                }
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
        },
        methods:
            {
                xacnhanxoa(item, index) {
                    var _this = this;
                    _this.dialogDelete = true;
                    _this.valueItem = item;
                    _this.positionItem = index;

                },
                async changeCheckbox() {
                    var _this = this;
                    if (_this.check_box_chua_sua == null) {
                        _this.check_box_chua_sua = 0;
                    }
                    if (_this.check_box_dang_sua == null) {
                        _this.check_box_dang_sua = 0;
                    }
                    if (_this.check_box_da_sua == null) {
                        _this.check_box_da_sua = 0;
                    }
                    try {
                        var response = await Axios.get(_this.url + '/api/list-mo-ta?check_box_dang_sua='
                            + _this.check_box_chua_sua + '&check_box_chua_sua=' +
                            _this.check_box_dang_sua + '&check_box_da_sua=' + _this.check_box_da_sua, {
                            headers: {
                                Authorization: 'Bearer' + ' ' + _this.token
                            }
                        });
                        if (response.status == 200) {
                            _this.listMota = [];
                            _this.listMota = response.data.data;
                        }
                    } catch (e) {
                        alert(e.response.data.message);
                    }

                },
                toggleAll() {
                    if (this.selected.length) this.selected = []
                    else this.selected = this.listMota.slice()
                }
                ,
                changeSort(column) {
                    if (this.pagination.sortBy === column) {
                        this.pagination.descending = !this.pagination.descending
                    } else {
                        this.pagination.sortBy = column
                        this.pagination.descending = false
                    }
                },

                // xacnhanxoa(item,index) {
                //     var _this = this;
                //     let uri = _this.url + '/api/delete-id/';
                //     console.log(index);
                //     Axios.delete(uri + item).then((response) => {
                //
                //         _this.isLoading = false;
                //         if (response.status == 200) {
                //             alert('Delete Success')
                //             _this.listMota.splice(index, 1)
                //         }
                //         //this.showData = response.data.data;
                //         //console.log(this.showData);
                //     })
                //     //_this.selectedGiangvien = item;
                //     //_this.dialog = true;
                //     console.log(item);
                // },
                async exportFile() {
                    let _this = this;
                    if (_this.check_box_chua_sua == null) {
                        _this.check_box_chua_sua = 0;
                    }
                    if (_this.check_box_dang_sua == null) {
                        _this.check_box_dang_sua = 0;
                    }
                    if (_this.check_box_da_sua == null) {
                        _this.check_box_da_sua = 0;
                    }
                    var data =
                        {
                            phong_may_id: typeof _this.selectedPhongMay.id === 'undefined' ? 0 : _this.selectedPhongMay.id,
                            //status: [_this.check_box_chua_sua,_this.check_box_dang_sua,_this.check_box_da_sua],
                            // check_box_dang_sua: _this.check_box_dang_sua,
                            // check_box_da_sua: _this.check_box_da_sua,
                            tuan_id: typeof _this.selectedTuan.id === 'undefined' ? 0 : _this.selectedTuan.id,
                        };
                    var exportData = await Axios.get(_this.url + '/api/export-danh-sach-loi?phong_may_id=' + data.phong_may_id + '&tuan_id=' + data.tuan_id,
                        {
                            headers: {
                                Authorization: 'Bearer' + ' ' + _this.token
                            }
                        });
                    if (exportData.status == 200) {
                        _this.urlExport = _this.url + exportData.data;
                        window.location.href = _this.urlExport;
                    }
                },
                xoaData() {
                    let _this = this;
                    Axios.delete(_this.url + '/api/delete-may-loi/' + _this.valueItem).then(response => {
                        if (response.status == 200) {
                            _this.success = ' xóa thanh công'
                            _this.dialogDelete = false
                            _this.listMota.splice(_this.positionItem, 1)
                            setTimeout(() => {
                                _this.success = ''
                            }, 3000)
                        } else {
                            alert('abc')
                        }

                    })

                },
                editItem(id) {
                    this.$router.push({path: `/update-PM-Ktv/${id}`});
                },
            }
    }
</script>

<style scoped>
    .filter-chk {
        height: 30px;
        margin: 0 !important;
    }
</style>