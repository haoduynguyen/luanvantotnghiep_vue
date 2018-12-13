<template>
    <div>
        <v-card-actions>
            <!--<v-btn v-bind:to="{name: 'Home'}">Back</v-btn>-->
            <v-spacer></v-spacer>
            <v-btn v-bind:to="{name: 'AddUser'}" color="success">Add</v-btn>
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
                        <td class="text-xs-center">{{ props.item.profile.gender == 1 ?"male" : "female" }}</td>
                        <td class="text-xs-center">{{ props.item.email }}</td>
                        <td class="text-xs-center">
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
	    <v-layout row justify-center>
		    <v-dialog v-model="dialog" max-width="500px">
			    <v-card>
				    <v-card-title>
					    <span class="headline">Lịch chi tiết</span>
				    </v-card-title>
				    <v-card-text>Bạn có muốn xóa
				    </v-card-text>

			    </v-card>
		    </v-dialog>
	    </v-layout>
    </div>
</template>

<script>
    export default {
        name: "ListUser",
        data: () => ({
            pagination: {
                sortBy: 'name'
            },
            selected: [],
            search: "",
            headers: [
                {
                    text: 'name',
                    align: 'left',
                    value: 'profile.first_name'
                },
                {text: 'gender', value: 'gender', align: 'left',},
                {text: 'email', value: 'email', align: 'left',},
                {text: 'action', value: '', align: 'left',},
            ],
            user: [],
	        dialog: false
        }),
        created: function () {
            var _this = this;
            _this.isLoading = true;
            let uri = 'http://luanvantn.dev.digiprojects.top/api/user';
            Axios.get(uri).then((response) => {
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
                    _this.dialog = false;
                    console.log(index);
                    // Axios.delete(_this.url + '/api/user/' + item).then(response => {
                    //     if (response.status == 200) {
                    //         alert('xóa thành công')
                    //         _this.user.splice(index, 1)
                    //     }
                    // })

                },
	            notification(){
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