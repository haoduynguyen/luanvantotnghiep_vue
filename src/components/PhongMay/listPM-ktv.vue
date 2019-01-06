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
                    :items="phongMay"
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
                        <td class="text-xs-center">{{ props.item.name }}</td>
                        <td class="text-xs-center">{{ props.item.so_may }}</td>
                        <td class="text-xs-center">{{ props.item.mo_ta }}</td>
                        <td class="text-xs-center">{{ props.item.ghi_chu }}</td>
                        <td class="text-xs-center">
                            <v-btn icon class="mx-0" @click="editItem(props.item.id)">
                                <v-icon color="teal">edit</v-icon>
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

    </div>
</template>

<script>
    export default {
        name: "listPM-ktv",
        data: () => ({
            pagination: {
                sortBy: 'name',
                rowsPerPage: 10, // -1 for All
            },
            selected: [],
            search: "",
            headers: [
                {text: 'Tên Phòng Máy', value: 'name', align: 'left',},
                {text: 'Số Máy', value: 'so_may', align: 'left',},
                {text: 'Mô Tả', value: 'mo_ta', align: 'left',},
                {text: 'Ghi Chú', value: 'ghi_chu', align: 'left',},
                {text: 'Action', value: '', align: 'left',},
            ],
            phongMay: [],
            dialog: false,
            success: '',
            info: '',
            valueItem: '',
            positionItem: '',
            dialogDelete: false,
            url: 'http://localhost:8000',
            //url: "https://luanvantn.dev.digiprojects.top",
        }),
        created: function () {
            var _this = this;
            _this.isLoading = true;
            let author = localStorage.getItem('author');
            let Auth = JSON.parse(author);
            _this.id = Auth['id'];
            _this.token = Auth['token'];
            let uri = _this.url + '/api/phong-may';
            Axios.get(uri, {
                headers: {
                    Authorization: 'Bearer' + ' ' + this.token
                }
            }).then((response) => {
                _this.isLoading = false;
                this.phongMay = response.data.data;
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
                changeSort(column) {
                    if (this.pagination.sortBy === column) {
                        this.pagination.descending = !this.pagination.descending
                    } else {
                        this.pagination.sortBy = column
                        this.pagination.descending = false
                    }
                },
                notification() {
                    _this.dialog = true;
                },
                editItem(id) {
                    this.$router.push({path: `/update-ds-ktv/${id}`});
                },
                // xacnhanxoa(item, index) {
                //     var _this = this;
                //     _this.dialogDelete = true;
                //     _this.valueItem = item;
                //     _this.positionItem = index;
                //     console.log(_this.positionItem);
                // },
                // xoaData() {
                //     let _this = this;
                //     _this.dialog = false;
                //     Axios.delete(_this.url + '/api/phong-may/' + _this.valueItem, {headers: {Authorization: 'Bearer' + ' ' + _this.token}}).then(response => {
                //         if (response.status == 200) {
                //             _this.success = ' Xóa Phòng Máy Thành Công';
                //             _this.dialogDelete = false;
                //             var index = _this.phongMay.findIndex(phongmay => phongmay.id == _this.valueItem);
                //             _this.phongMay.splice(index, 1);
                //             setTimeout(() => {
                //                 _this.success = ''
                //             }, 3000)
                //         }
                //     }).catch(function (error) {
                //         _this.info = error.response.data.message;
                //         _this.dialogDelete = false;
                //         setTimeout(() => {
                //             _this.info = '';
                //         }, 3000);
                //     })
                // },
            }
    }
</script>

<style scoped>

</style>