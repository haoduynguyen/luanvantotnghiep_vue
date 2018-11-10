<template>
    <div>
        <!--<v-card-actions>-->
        <!--&lt;!&ndash;<v-btn v-bind:to="{name: 'Home'}">Back</v-btn>&ndash;&gt;-->
        <!--<v-spacer></v-spacer>-->
        <!--<v-btn v-bind:to="{name: 'AddUser'}" color="success">Add</v-btn>-->
        <!--</v-card-actions>-->
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
                    <tr :active="props.selected" @click="props.selected = !props.selected">
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
                        <td class="text-xs-center">{{ props.item.mota_gv != null ? props.item.mota_gv : ""  }}</td>
                        <td class="text-xs-center">{{ props.item.ky_thuat_vien != null ? props.item.ky_thuat_vien.profile.first_name + ' ' + props.item.giang_vien.profile.last_name : ""  }}</td>
                        <td class="text-xs-center">{{ props.item.mota_ktv != null ? props.item.mota_ktv : "" }}</td>
                        <td class="text-xs-center" v-if=" props.item.status == 1">{{ "Đang chờ sửa lỗi" }}</td>
                        <td class="text-xs-center">
                            <v-btn icon class="mx-0" @click="editItem(props.item.id)">
                                <v-icon color="teal">edit</v-icon>
                            </v-btn>
                            <v-btn icon class="mx-0" @click="xacnhanxoa(props.item)">
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
                {text: 'Tình Trạng', value: '', align: 'left',},
                {text: 'Chức Năng', value: '', align: 'left',},
            ],
            listMota: [],
        }),
        created: function () {
            let author = localStorage.getItem('author')
            let auth = JSON.parse(author);
            this.token = auth['token']
            var _this = this;
            _this.isLoading = true;
            let uri = 'http://luanvantn.dev.digiprojects.top/api/list-mo-ta';
            Axios.get(uri, {
                headers: {
                    Authorization: 'Bearer' + ' ' + this.token
                }
            }).then((response) => {
                console.log(response);
                _this.isLoading = false;
                this.listMota = response.data.data;
            }).catch(error => {
                if (!error.response) {
                    // network error
                    this.errorStatus = 'Error: Network Error';
                    console.log(error.response.data.message);
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
        },
        methods:
            {
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
                // xacnhanxoa(item) {
                //     var _this = this;
                //     _this.selectedGiangvien = item;
                //     _this.dialog = true;
                // },
                editItem(id) {
                    this.$router.push({path: `/edit-user/${id}`});
                },
            }
    }
</script>

<style scoped>

</style>