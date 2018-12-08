<template>
    <div>
        <v-navigation-drawer
                fixed
                :clipped="$vuetify.breakpoint.mdAndUp"
                app
                v-model="drawer"
        >
            <v-list dense>
                <template>
                    <div v-if="role_id==1" v-for="item in itemsGV">
                        <v-layout
                                row
                                v-if="item.heading"
                                align-center
                                :key="item.heading"
                        >
                            <v-flex xs6>
                                <v-subheader v-if="item.heading">
                                    {{ item.heading }}
                                </v-subheader>
                            </v-flex>
                            <v-flex xs6 class="text-xs-center">
                                <a href="#!" class="body-2 black--text">EDIT</a>
                            </v-flex>
                        </v-layout>
                        <v-list-group
                                v-else-if="item.children"
                                v-model="item.model"
                                :key="item.text"
                                :prepend-icon="item.model ? item.icon : item['icon-alt']"
                                append-icon=""
                        >
                            <v-list-tile slot="activator">
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ item.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile
                                    v-for="(child, i) in item.children"
                                    :key="i"
                                    @click=""
                                    :to="{name: child.path}"
                            >
                                <v-list-tile-action v-if="child.icon">
                                    <v-icon>{{ child.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ child.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-group>
                        <v-list-tile v-else @click="" :key="item.text" :to="{name: item.path}">
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </div>
                    <div v-if="role_id==2" v-for="item in itemsKTV">
                        <v-layout
                                row
                                v-if="item.heading"
                                align-center
                                :key="item.heading"
                        >
                            <v-flex xs6>
                                <v-subheader v-if="item.heading">
                                    {{ item.heading }}
                                </v-subheader>
                            </v-flex>
                            <v-flex xs6 class="text-xs-center">
                                <a href="#!" class="body-2 black--text">EDIT</a>
                            </v-flex>
                        </v-layout>
                        <v-list-group
                                v-else-if="item.children"
                                v-model="item.model"
                                :key="item.text"
                                :prepend-icon="item.model ? item.icon : item['icon-alt']"
                                append-icon=""
                        >
                            <v-list-tile slot="activator">
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ item.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile
                                    v-for="(child, i) in item.children"
                                    :key="i"
                                    @click=""
                                    :to="{name: child.path}"
                            >
                                <v-list-tile-action v-if="child.icon">
                                    <v-icon>{{ child.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ child.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-group>
                        <v-list-tile v-else @click="" :key="item.text" :to="{name: item.path}">
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </div>
                    <div v-if="role_id==3" v-for="item in itemsAdmin">
                        <v-layout
                                row
                                v-if="item.heading"
                                align-center
                                :key="item.heading"
                        >
                            <v-flex xs6>
                                <v-subheader v-if="item.heading" >
                                    {{ item.heading }}
                                </v-subheader>
                            </v-flex>
                            <v-flex xs6 class="text-xs-center">
                                <a href="#!" class="body-2 black--text">EDIT</a>
                            </v-flex>
                        </v-layout>
                        <v-list-group
                                v-else-if="item.children"
                                v-model="item.model"
                                :key="item.text"
                                :prepend-icon="item.model ? item.icon : item['icon-alt']"
                                append-icon=""
                        >
                            <v-list-tile slot="activator">
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ item.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile
                                    v-for="(child, i) in item.children"
                                    :key="i"
                                    @click=""
                                    :to="{name: child.path}"
                            >
                                <v-list-tile-action v-if="child.icon">
                                    <v-icon>{{ child.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ child.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-group>
                        <v-list-tile v-else @click="" :key="item.text" :to="{name: item.path}">
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </div>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar
                color="pink darken-3"
                dark
                app
                :clipped-left="$vuetify.breakpoint.mdAndUp"
                fixed
        >
            <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span class="hidden-sm-and-down">Luận Văn Tốt Nghiệp</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <label>
                {{name}}
            </label>

            <!--<v-btn icon>-->
            <!--<v-icon>notifications</v-icon>-->
            <!--</v-btn>-->
            <!--<v-btn icon large>-->
            <!--<v-avatar size="32px" tile>-->
            <!--</v-avatar>-->
            <!--</v-btn>-->
            <!--<label v-model="name"></label>-->
            <v-menu offset-y>
                <v-btn icon small
                       slot="activator"
                       color="white"
                       dark
                >
                    <v-avatar size="32px" tile>
                        <img
                                class="avatar"
                                :src="img"
                                alt="Vuetify"
                        >
                    </v-avatar>
                </v-btn>
                <v-list>
                    <v-list-tile v-if="item.title != 'Logout' "
                                 v-for="(item, index) in items"
                                 :key="index"
                                 :to="{path: item.path + id}"
                                 @click=""
                    >
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile v-if="item.title == 'Logout' "
                                 v-for="(item, index) in items"
                                 :key="index"
                                 @click="signOut"
                    >
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>
    </div>
</template>

<script>
    import image from "../assets/logo.png";

    export default {
        name: "Menu",
        data: () => ({
            dialog: false,
            drawer: null,
            img: image,
            id: 0,
            name: '',
            //url:'http://luanvantn.dev.digiprojects.top',
            url: 'http://localhost:8000',
            items: [
                {
                    title: 'Change Password', path: '/change-password/', test: () => {
                    }
                },
                {
                    title: 'Profile', test: () => {
                    }, path: "/edit-user/"
                },
                {
                    title: 'Logout', test: () => {
                    }
                },
            ],
            itemsGV: [
                {icon: 'event', text: 'Lịch Dạy Chi Tiết', path: 'LichDayGV'},
                {icon: 'schedule', text: 'Đăng Ký Mượn Phòng', path: 'TestMuonPhong'},
                {icon: 'list', text: 'Danh Sách Mô Tả PM', path: 'ListMoTaGV'},
                {icon: 'list', text: 'Danh Sách Mượn Phòng', path: 'ListMuonPhong'},
                {icon: 'list', text: 'Danh Sách Đăng Ký Nghỉ', path: 'ListDangKyNghi'},

            ],
            itemsKTV: [
                // {
                //     icon: 'contacts',
                //     'icon-alt': 'keyboard_arrow_down',
                //     text: 'User',
                //     model: false,
                //     children: [
                //         {icon: '', text: 'List', path: 'ListUser'},
                //     ]
                // },
                {icon: 'event', text: 'Lịch Dạy', path: 'LichDay'},
                {icon: 'schedule', text: 'Đăng Ký Mượn Phòng', path: 'TestMuonPhong'},
                {icon: 'list', text: 'Danh Sách Giảng Viên', path: 'ListUser'},
                {icon: 'list', text: 'Danh Sách Máy Lỗi', path: 'ListMayLoi'},



            ],
            itemsAdmin: [
                {icon: 'event', text: 'Lịch Dạy', path: 'LichDay'},
                //{icon: 'schedule', text: 'Lịch Dạy Chi Tiết', path: 'LichDayGV'},
                {icon: 'schedule', text: 'Đăng Ký Mượn Phòng', path: 'TestMuonPhong'},
                {icon: 'list', text: 'Danh Sách Giảng Viên', path: 'ListUser'},
                {icon: 'list', text: 'Danh Sách Mô Tả PM', path: 'ListMoTaGV'},
                {icon: 'list', text: 'Danh Sách Máy Lỗi', path: 'ListMayLoi'},
                {icon: 'list', text: 'Danh Sách Mượn Phòng', path: 'ListMuonPhong'},
                {icon: 'list', text: 'Danh Sách Đăng Ký Nghỉ', path: 'ListDangKyNghi'},
            ],
            role_id: ''
        }),
        created: function () {
            var _this = this
            let author = localStorage.getItem('author')
            let Auth = JSON.parse(author);
            var token = Auth['token']
            var uri = _this.url + '/api/get-user'
            Axios.get(uri, {
                headers: {
                    Authorization: 'Bearer' + ' ' + token
                }
            }).then((response) => {
                _this.isLoading = false;
                var user = response.data.data;
                _this.name = user.profile.first_name + ' ' + user.profile.last_name
                _this.id = user.id
                _this.role_id = user.role_id
            });
        },
        methods: {
            logout() {
                localStorage.clear();
                StorageArea.clear();
                //storage.removeItem("https://accounts.google.com");
                this.$router.push({name: 'Login'})
            },
            async signOut() {
                const googleAuth = gapi.auth2.getAuthInstance()
                await googleAuth.signOut()
                const googleUser = googleAuth.currentUser.get()
                googleUser.disconnect()
                localStorage.clear();
                //storage.removeItem("https://accounts.google.com");
                // window.location.reload()
                this.$router.push({name: 'Login'})
            }
        }
    }
</script>

<style scoped>

</style>