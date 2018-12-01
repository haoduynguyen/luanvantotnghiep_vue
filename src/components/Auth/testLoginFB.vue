<template>
    <div>
        <fb-signin-button
                :params="fbSignInParams"
                @success="onSignInSuccess"
                @onlogin="checkLoginState"
                @error="onSignInError">
            Sign in with Facebook
        </fb-signin-button>
        <v-card-actions>
            <v-btn type="submit" class="btn btn-xs btn-primary" @click="logoutFB">LogOut</v-btn>
            <v-spacer></v-spacer>

        </v-card-actions>
    </div>
</template>

<script>
    export default {
        name: "testLoginFB",
        data() {
            return {
                fbSignInParams: {
                    scope: 'email,user_likes',
                    return_scopes: true
                }
            }
        },
        created: function () {
            const _this = this
            _this.checkLoginState();
        },
        methods: {
            onSignInSuccess(response) {
                console.log('login',response);

                FB.api('/me', dude => {
                    console.log(`Good to see you, ${dude.name}.`)
                })
            },
            logoutFB() {
                console.log('aaa');
                FB.logout(function(response) {
                    console.log('logout',response);
                });
            },
            checkLoginState() {
                FB.getLoginStatus(function(response) {
                    console.log('aaaa',response.authResponse.accessToken);
                    if (response.status === 'connected') {
                        // Logged into your app and Facebook.
                        console.log('Welcome!  Fetching your information.... ');
                        FB.api('/me', function (response) {
                            console.log('Successful login for: ' + response.name);
                        });
                    }
                });
            }
        },
    }
</script>

<style scoped>
    .fb-signin-button {
        /* This is where you control how the button looks. Be creative! */
        display: inline-block;
        padding: 4px 8px;
        border-radius: 3px;
        background-color: #4267b2;
        color: #fff;
    }
</style>