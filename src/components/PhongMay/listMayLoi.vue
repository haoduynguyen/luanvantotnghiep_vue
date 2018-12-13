<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="fillter" style="width: 200px">
                    <v-checkbox class="filter-chk" :label="`Chưa Sửa`" value="1" v-model="check_box_chua_sua"
                                @change="changeCheckbox"></v-checkbox>
                    <v-checkbox class="filter-chk" :label="`Đang Sửa`" value="2" v-model="check_box_dang_sua"
                                @change="changeCheckbox"></v-checkbox>
                    <v-checkbox class="filter-chk" :label="`Đã Sửa`" value="3" v-model="check_box_da_sua"
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
                <v-btn @click="exportFile" class="btn btn-xs btn-success" color="primary">Export</v-btn>
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
                        <th>
                            <v-checkbox
                                    :input-value="props.all"
                                    :indeterminate="props.indeterminate"
                                    primary
                                    hide-details
                                    @click.native="toggleAll"
                            ></v-checkbox>
                        </th>
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
                    <tr :active="props.selected" @click="props.item.selected = !props.selected">
                        <td>
                            <v-checkbox
                                    :input-value="props.selected"
                                    primary
                                    hide-details
                            ></v-checkbox>
                        </td>
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
                        <td class="text-xs-center">{{ props.item.mota_ktv != null ? props.item.mota_ktv : "" }}</td>
                        <td class="text-xs-center">{{ props.item.created_at != null ? props.item.created_at : "" }}</td>
                        <td class="text-xs-center">{{ (props.item.status == 3 && props.item.updated_at != null) ?
                            props.item.updated_at : "-" }}
                        </td>
                        <td class="text-xs-center">
                            <v-btn icon class="mx-0" @click="editItem(props.item.id)">
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
                {text: 'Mô Tả Kỹ Thuật Viên', value: 'giang_vien.profile.first_name', align: 'left',},
                {text: 'Ngày Tạo', value: '', align: 'left',},
                {text: 'Ngày Sửa', value: '', align: 'left',},
                {text: 'Chức Năng', value: '', align: 'left',},
            ],
            listMota: [],
            // url:'http://luanvantn.dev.digiprojects.top',
            url: 'http://localhost:8000',
            urlExport: '',
            listPhongMay: [],
            selectedPhongMay: 0,
            check_box_chua_sua: 0,
            check_box_dang_sua: 0,
            check_box_da_sua: 0,
        }),
        created: function () {
            var _this = this;
            let author = localStorage.getItem('author');
            let auth = JSON.parse(author);
            _this.token = auth['token'];
            _this.isLoading = true;
            let uri = _this.url + '/api/list-mo-ta';
            Axios.get(uri, {
                headers: {
                    Authorization: 'Bearer' + ' ' + _this.token
                }
            }).then((response) => {
                _this.isLoading = false;
                _this.listMota = response.data.data;
                console.log(response.data.data);
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                    console.log(error.response.data.message);
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
        },
        methods:
            {
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
                            + _this.check_box_chua_sua + '&check_box_chua_sua=' + _this.check_box_dang_sua + '&check_box_da_sua=' + _this.check_box_da_sua, {
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
                            phong_may_id: _this.selectedPhongMay.id,
                            check_box_chua_sua: _this.check_box_chua_sua,
                            check_box_dang_sua: _this.check_box_dang_sua,
                            check_box_da_sua: _this.check_box_da_sua
                        };
                    var exportData = await Axios.get(_this.url + '/api/export-danh-sach-loi?phong_may_id=' + data.phong_may_id +
                        '&check_box_chua_sua=' + data.check_box_chua_sua + '&check_box_dang_sua=' + data.check_box_dang_sua + '&check_box_da_sua=' + data.check_box_da_sua,
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
                xacnhanxoa(item, index) {
                    let _this = this;
                    console.log(item, index);
                    Axios.delete(_this.url + '/api/delete-may-loi/' + item).then(response => {
                        if (response.status == 200) {
                            alert('xóa thành công')
                            _this.listMota.splice(index, 1)
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