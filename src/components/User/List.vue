<template>
    <div>
        <v-card-actions>
            <!--<v-btn v-bind:to="{name: 'Home'}">Back</v-btn>-->
            <v-spacer></v-spacer>
            <v-btn v-if="auth == 3" v-bind:to="{name: 'AddUser'}" color="success">Thêm</v-btn>
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
                    :headers="auth == 3 ? headers : headers1"
                    :items="user"
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
                        <td class="text-xs-center">{{ props.item.profile.first_name + ' ' + props.item.profile.last_name
                            }}
                        </td>
                        <td class="text-xs-center">{{ props.item.email }}</td>
                        <td class="text-xs-center" v-if="props.item.role_id == 3 ">Admin</td>
                        <td class="text-xs-center" v-else-if="props.item.role_id == 2 ">Kỹ Thuật Viên</td>
                        <td class="text-xs-center" v-else>Giảng Viên</td>
                        <td class="text-xs-center">{{ props.item.profile.gender == 1 ?"male" : "female" }}</td>
                        <td class="text-xs-center">{{ props.item.profile.phone}}</td>
                        <td class="text-xs-center" v-if="auth == 3">

                            <!--<v-btn v-if="auth != 3" disabled icon class="mx-0" @click="editItem(props.item.id)">-->
                                <!--<v-icon color="teal">edit</v-icon>-->
                            <!--</v-btn>-->
                            <!--<v-btn v-else icon class="mx-0" @click="editItem(props.item.id)">-->

                            <v-btn icon class="mx-0" @click="editItem(props.item.id)">
                                <v-icon color="teal">edit</v-icon>
                            </v-btn>
                            <v-btn icon class="mx-0" @click="xacnhanxoa(props.item.id , props.index)">
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
    import url from '../../middleware/domain';
    export default {
        name: "ListUser",
        data: () => ({
            pagination: {
                sortBy: 'name',
                rowsPerPage: 10, // -1 for All
            },
            auth: '',
            selected: [],
            search: "",
            headers: [
                {text: 'Họ Tên', align: 'left', value: 'profile.first_name'},
                {text: 'Email', value: 'email', align: 'left',},
                {text: 'Chức Vụ', align: 'left',},
                {text: 'Giới Tính', value: 'gender', align: 'left',},
                {text: 'Số Điện Thoại', value: 'phone', align: 'left',},
                {text: 'Action', value: '', align: 'left',},
            ],
            headers1: [
                {text: 'Họ Tên', align: 'left', value: 'profile.first_name'},
                {text: 'Email', value: 'email', align: 'left',},
                {text: 'Chức Vụ', align: 'left',},
                {text: 'Giới Tính', value: 'gender', align: 'left',},
                {text: 'Số Điện Thoại', value: 'phone', align: 'left',},
            ],
            user: [],
            dialog: false,
            success: '',
            info: '',
            valueItem: '',
            positionItem: '',
            dialogDelete: false,
            //url:'http://localhost:8000',
            //url: "https://luanvantn.dev.digiprojects.top",
        }),
        created: function () {
            var _this = this;
            _this.isLoading = true;
            let author = localStorage.getItem('author');
            let Auth = JSON.parse(author);
            _this.id = Auth['id'];
            _this.token = Auth['token'];
            _this.auth = Auth.role_id;
            console.log(Auth);
            let uri = url.url + '/api/user';
            Axios.get(uri, {
                headers: {
                    Authorization: 'Bearer' + ' ' + this.token
                }
            }).then((response) => {
                _this.isLoading = false;
                this.user = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                    console.log(error.response.data.message);
                } else {
                    this.errorStatus = error.response.data.message;
                    console.log(this.errorStatus);
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
                    console.log(_this.positionItem);
                },
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
                xoaData() {
                    let _this = this;
                    _this.dialog = false;
                    Axios.delete(url.url + '/api/user/' + _this.valueItem).then(response => {
                        if (response.status == 200) {
                            _this.success = ' Xóa thành công'
                            _this.dialogDelete = false
                            var index = _this.user.findIndex(user => user.id == _this.valueItem);
                            _this.user.splice(index, 1);
                            setTimeout(() => {
                                _this.success = ''
                            }, 3000)
                        }
                    }).catch(function (error) {
                        _this.info = error.response.data.message;
                        _this.dialogDelete = false;
                        setTimeout(() => {
                            _this.info = '';
                        }, 3000);
                    })
                },
                notification() {
                    _this.dialog = true;
                },
                editItem(id) {
                    this.$router.push({path: `/edit-user/${id}`});
                },
            }
    }
</script>

<style scoped>

</style>