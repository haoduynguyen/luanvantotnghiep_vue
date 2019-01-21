<template>
    <div>
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
        <v-card-actions>
            <!--<v-btn v-bind:to="{name: 'Home'}">Back</v-btn>-->
            <v-spacer></v-spacer>
        </v-card-actions>
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
                    :items="dangKyNghi"
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
                    <tr :active="props.selected" @click="props.item.selected = !props.item.selected">
                        <td class="text-xs-center">{{ props.item.lichDay.user.profile.first_name + " " + props.item.lichDay.user.profile.last_name  }}
                        </td>
                        <td class="text-xs-center">{{ props.item.lichDay.phong_may.name}}</td>
                        <td class="text-xs-center">{{ props.item.lichDay.mon_hoc.name }}</td>
                        <td class="text-xs-center">{{ props.item.lichDay.nhom_lop.name }}</td>
                        <td class="text-xs-center">{{ props.item.lichDay.ca.name }}</td>
                        <td class="text-xs-center">{{ props.item.lichDay.thu.name }}</td>
                        <td class="text-xs-center">{{ props.item.lichDay.hoc_ky.name }}</td>
                        <td class="text-xs-center">{{ props.item.ngay_nghi }}</td>
                        <td class="text-xs-center">
                            <v-btn icon class="mx-0" @click="xacnhanxoa(props.item.id , props.index)">
                                <v-icon color="pink">delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
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
    import url from '../../middleware/domain';
    export default {
        name: "DangKyNghi",
        data: () => ({
            pagination: {
                sortBy: 'name'
            },
            selected: [],
            search: "",
            headers: [
                {text: 'Tên Giảng Viên', align: 'left', value: 'profile.first_name'},
                {text: 'Phòng Máy', value: '', align: 'left',},
                {text: 'Môn Học', value: '', align: 'left',},
                {text: 'Nhóm Lớp', value: '', align: 'left',},
                {text: 'Ca Học', value: '', align: 'left',},
                {text: 'Thứ', value: '', align: 'left',},
                {text: 'Học Kỳ', value: '', align: 'left',},
                {text: 'Ngày Nghỉ', value: '', align: 'left',},
                {text: 'Action', value: '', align: 'left',},

            ],
            dangKyNghi: [],
            //url:'http://localhost:8000',
            //url: "https://luanvantn.dev.digiprojects.top",
            token:'',
            success:'',
            info:'',
            valueItem:'',
            positionItem:'',
            dialogDelete:false
        }),
        created: function () {
            var _this = this;
            let author = localStorage.getItem('author')
            let Auth = JSON.parse(author);
            var token = Auth['token']
            _this.token = token;
            _this.isLoading = true;
            let uri = url.url + '/api/get-dk-nghi';
            Axios.get(uri,{
                headers: {
                    Authorization: 'Bearer' + ' ' + token
                }
            }).then((response) => {
                _this.isLoading = false;
                this.dangKyNghi = response.data.data;
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
                toggleAll() {
                    if (this.selected.length) this.selected = []
                    else this.selected = this.user.slice()
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
                xacnhanxoa(item, index) {
                    var _this = this;
                    _this.dialogDelete = true;
                    _this.valueItem = item;
                    _this.positionItem = index;

                },
                xoaData() {
                    let _this = this;
                    console.log(_this.valueItem);
                    var data = {
                        timeDKN : new Date().getHours() + ":" + new Date().getMinutes(),
                    }
                    console.log(data);
                    Axios.put(url.url + '/api/update-status-nghi/' + _this.valueItem, data , {
                        headers: {
                            Authorization: 'Bearer' + ' ' + _this.token
                        }
                    }).then(response => {
                        if (response.status == 200) {
                            _this.dangKyNghi.splice(_this.positionItem, 1);
                            _this.dialogDelete = false;
                            _this.success = 'xóa thành công';
                            setTimeout(() => {
                                _this.success = '';
                            }, 2000);
                        }
                    }).catch(function (error) {
                        _this.info = error.response.data.message;
                        _this.dialogDelete = false;
                        setTimeout(() => {
                            _this.info = '';
                        }, 2000);
                    })
                },
                editItem(id) {
                    this.$router.push({path: `/edit-user/${id}`});
                },
            }
    }
</script>

<style scoped>

</style>