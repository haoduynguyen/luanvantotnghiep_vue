<template>
    <div>
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
                    <tr :active="props.selected" @click="props.item.selected = !props.item.selected">
                        <td>
                            <v-checkbox
                                    :input-value="props.item.selected"
                                    primary
                                    hide-details
                            ></v-checkbox>
                        </td>
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
                            <v-btn icon class="mx-0" @click="xacnhanxoa(props.item.id , props.item.index)">
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
            url:'http://luanvantn.dev.digiprojects.top',
            token:''
        }),
        created: function () {
            var _this = this;
            let author = localStorage.getItem('author')
            let Auth = JSON.parse(author);
            var token = Auth['token']
            _this.token = token;
            _this.isLoading = true;
            let uri = _this.url + '/api/get-dk-nghi';
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
                    let _this = this;

                    Axios.delete(_this.url + '/api/dang-ky-nghi/' + item,{
                        headers: {
                            Authorization: 'Bearer' + ' ' + _this.token
                        }
                    }).then(response => {
                        if (response.status == 200) {
                            alert('xóa thành công')
                            _this.muonPhong.splice(index, 1)
                        }
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