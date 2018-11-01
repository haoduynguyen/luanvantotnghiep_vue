<template>
    <v-app id="inspire">
        <Menu/>
        <!--<img src="./assets/logo.png">-->
        <v-content>
            <v-container>
                <router-view/>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import MenuLayout from "./components/Menu"

    export default {
        name: 'App',
        components: {
            'Menu': MenuLayout
        },

    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
