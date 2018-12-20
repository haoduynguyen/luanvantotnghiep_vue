
<template>
    <div>
        <v-card>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                ></v-text-field>
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
                        <td class="text-xs-center">{{ props.item.giang_vien.profile.first_name + ' ' + props.item.giang_vien.profile.last_name
                            }}
                        </td>
                        <td class="text-xs-center">{{ props.item.mota_gv != null ? props.item.mota_gv : "" }}</td>
                        <td class="text-xs-center">{{ props.item.ky_thuat_vien != null ? props.item.ky_thuat_vien.profile.first_name + ' ' + props.item.ky_thuat_vien.profile.last_name : "" }}</td>
                        <td class="text-xs-center">{{ props.item.mota_ktv != null ? props.item.mota_ktv : "" }}</td>
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
        name: "listMayLoiGv",
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
                {text: 'Tên Kỹ Thuật Viên', value: 'ky_thuat_vien.profile.first_name', align: 'left',},
                {text: 'Mô Tả Kỹ Thuật Viên', value: 'mota_ktv', align: 'left',},


                {text: 'Chức Năng', value: '', align: 'left',},
            ],
            listMota: [],
            url: 'https://luanvantn.dev.digiprojects.top',
            //url:'http://localhost:8000',
            success: '',
            info: '',
            valueItem: '',
            positionItem: '',
            dialogDelete: false,
        }),
        created: function () {
            let author = localStorage.getItem('author')
            let auth = JSON.parse(author);
            this.token = auth['token']
            var _this = this;
            _this.isLoading = true;
            let uri = _this.url + '/api/list-mo-ta';
            Axios.get(uri, {
                headers: {
                    Authorization: 'Bearer' + ' ' + this.token
                }
            }).then((response) => {
                _this.isLoading = false;
                _this.listMota = response.data.data;
                console.log(_this.listMota);
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                    console.log(error.response);
                } else {
                    //this.errorStatus = error.response.data.message;
                    console.log(error.response);
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

                xoaData() {
                    let _this = this;
                    Axios.delete(_this.url + '/api/delete-may-loi/' + _this.valueItem).then(response => {
                        if (response.status == 200) {
                            _this.success = ' xóa thành công'
                            _this.dialogDelete = false
                            _this.listMota.splice(_this.positionItem, 1)
                            setTimeout(() => {
                                _this.success = ''
                            },3000)
                        }
                    }).catch(function (error) {
                        _this.info = error.response.data.message;
                        _this.dialogDelete = false;
                        setTimeout(()=>{
                            _this.info = '';
                        }, 2000);
                    })
                },
                editItem(id) {
                    this.$router.push({path: `/update-PM/${id}`});
                },
            }
    }
</script>

<style scoped>

</style>