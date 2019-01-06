<template>
    <div>
        <v-form v-on:submit.prevent="update" method="post" class="custom-style">
            <div v-for="item in dataMenu">
                <v-layout row wrap class="light--text">
                    <v-flex xs4>{{item.text}}:</v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs4>
                        <v-checkbox :value="[[item.name,item.icon,item.text]]" v-model="check_box"></v-checkbox>
                    </v-flex>
                </v-layout>
            </div>
            <v-card-actions>
                <v-btn v-bind:to="{name: 'ListMayLoi'}">Trở về</v-btn>
                <v-spacer></v-spacer>
                <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Lưu</v-btn>
            </v-card-actions>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: "permission",
        data: () => ({
            items: [],
            check_box:[],
            dataMenu:[],
            url:'http://localhost:8000'
        }),
        created: function () {
            var _this = this;
            let author = localStorage.getItem('author')
            let user = JSON.parse(author); // parse tu chuoi sang mang
            _this.token = user['token'];
            //console.log(_this.$router.options.routes);
            _this.items = _this.$router.options.routes[5].children;
            for(var menu of _this.items){
                if(menu.menu == 1){
                    _this.dataMenu.push(menu);
                }
            }
        },
        methods: {
            update() {
                var _this = this
                var data= {
                    permission : _this.check_box,
                    role_id :3,
                }
                Axios.post(_this.url + '/api/role/' , data,{ headers: {
                        Authorization: 'Bearer' + ' ' + this.token
                    }}).then((response) => {
                    if (response.status  == 200) {
                        _this.success = 'Sửa thành công';
                    }
                }).catch(function (error) {
                    _this.info = error.response.data.message;
                    setTimeout(() => {
                        _this.info = '';
                    }, 2000);
                });
            }
        }
    }

</script>

<style scoped>

</style>