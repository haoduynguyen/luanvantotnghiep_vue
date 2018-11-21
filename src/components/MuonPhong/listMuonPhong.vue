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
                    :items="muonPhong"
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
                        <td class="text-xs-center">{{ props.item.user_id }}
                        </td>
                        <td class="text-xs-center">{{ props.item.phong_may_id }}</td>
                        <td class="text-xs-center">{{ props.item.mon_hoc_id }}</td>
                        <td class="text-xs-center">{{ props.item.ca_id }}</td>
                        <td class="text-xs-center">{{ props.item.thu_id }}</td>
                        <td class="text-xs-center">{{ props.item.hk_id }}</td>
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
        name: "listMuonPhong",
        data: () => ({
            pagination: {
                sortBy: 'name'
            },
            selected: [],
            search: "",
            headers: [
                {text: 'Tên Giảng Viên', align: 'left', value: 'profile.first_name'},
                {text: 'Phòng Máy', value: 'gender', align: 'left',},
                {text: 'Môn Học', value: 'email', align: 'left',},
                {text: 'Ca Học', value: '', align: 'left',},
                {text: 'Thứ', value: '', align: 'left',},
                {text: 'Học Kỳ', value: '', align: 'left',},
                {text: 'Action', value: '', align: 'left',},
            ],
            muonPhong: [],
            url:'http://luanvantn.dev.digiprojects.top'
        }),
        created: function () {
            var _this = this;
	        let author = localStorage.getItem('author')
	        let Auth = JSON.parse(author);
	        var token = Auth['token']
            _this.isLoading = true;
            let uri = _this.url + '/api/get-ds-muon-phong';
            Axios.get(uri,{
            	headers: {
            		Authorization: 'Bearer' + ' ' + token
                }
            }).then((response) => {
                _this.isLoading = false;
                this.muonPhong = response.data.data;
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
                    Axios.delete(_this.url + '/api/user/' + item).then(response => {
                        if (response.status == 200) {
                            alert('xóa thành công')
                            _this.user.splice(index, 1)
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