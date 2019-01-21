<template>
    <div>
        <v-card-actions>
            <!--<v-btn v-bind:to="{name: 'Home'}">Back</v-btn>-->
            <v-spacer></v-spacer>
        </v-card-actions>
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
                    :items="muonPhong"
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
                        <td class="text-xs-center">{{ props.item.user.profile.first_name + " " +
                            props.item.user.profile.last_name }}
                        </td>
                        <td class="text-xs-center">{{ props.item.phong_may.name}}</td>
                        <td class="text-xs-center">{{ (props.item.mon_hoc != null) ? props.item.mon_hoc.name :
                            props.item.ghi_chu }}
                        </td>
                        <td class="text-xs-center">{{ props.item.ca.name }}</td>
                        <td class="text-xs-center">{{ props.item.thu.name }}</td>
                        <td class="text-xs-center">{{ props.item.hoc_ky.name }}</td>
                        <td class="text-xs-center">{{ props.item.ngay_muon }}</td>
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
        name: "listMuonPhong",
        data: () => ({
            pagination: {
                sortBy: 'name'
            },
            selected: [],
            search: "",
            headers: [
                {text: 'Tên Giảng Viên', align: 'left', value: 'user.profile.first_name'},
                {text: 'Phòng Máy', value: 'gender', align: 'left',},
                {text: 'Môn Học', value: 'email', align: 'left',},
                {text: 'Ca Học', value: '', align: 'left',},
                {text: 'Thứ', value: '', align: 'left',},
                {text: 'Học Kỳ', value: '', align: 'left',},
                {text: 'Ngày Mượn Phòng', value: '', align: 'left',},
                {text: 'Action', value: '', align: 'left',},

            ],
            muonPhong: [],
            //url: 'https://luanvantn.dev.digiprojects.top',
            //url: 'http://localhost:8000',
            token: '',
            valueItem: '',
            positionItem: '',
            dialogDelete: false,
            success: '',
            info: '',
        }),
        created: function () {
            var _this = this;
            let author = localStorage.getItem('author')
            let Auth = JSON.parse(author);
            var token = Auth['token']
            _this.token = token;
            _this.isLoading = true;
            let uri = url.url + '/api/get-ds-muon-phong';
            Axios.get(uri, {
                headers: {
                    Authorization: 'Bearer' + ' ' + token
                }
            }).then((response) => {
                _this.isLoading = false;
                _this.muonPhong = response.data.data;
                console.log(_this.muonPhong);
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
                    Axios.put(url.url + '/api/update-status-mp/' + _this.valueItem, {
                        headers: {
                            Authorization: 'Bearer' + ' ' + _this.token
                        }
                    }).then(response => {
                        if (response.status == 200) {
                            _this.muonPhong.splice(_this.positionItem, 1)
                            _this.dialogDelete = false;
                            _this.success = 'Xóa Đăng Ký Thành Công';
                            setTimeout(() => {
                                _this.success = '';
                            }, 2000);
                        }
                    }).catch(function (error) {
                        _this.info = error.response.data.message;
                        _this.dialogDelete = false;
                        setTimeout(()=>{

                            _this.info = '';
                        }, 2000);
                    })
                }
            },
        editItem(id) {
            this.$router.push({path: `/edit-user/${id}`});
        },
    }
</script>

<style scoped>

</style>