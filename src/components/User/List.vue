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
                        <td class="text-xs-center">{{ props.item.profile.first_name + ' ' + props.item.profile.last_name }}</td>
                        <td class="text-xs-center">{{ props.item.profile.gender==1 ?"male" : "female" }}</td>
                        <td class="text-xs-center">{{ props.item.email }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
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
            ],
            user: [],
        }),
        created: function () {
            var _this = this;
            _this.isLoading = true;
            let uri = 'http://localhost:8000/api/user';
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
                }
            }
    }
</script>

<style scoped>

</style>