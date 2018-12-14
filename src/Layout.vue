<template>
    <v-app id="inspire">
        <router-view/>
    </v-app>
</template>

<script>
    export default {
        name: "Layout"
    }
</script>

<style>
    .alert-effect {
        animation: animations 1s;
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 32.2%;
        z-index: 99;



    }
    @keyframes animations {
        from {top: -20px}
        to {top: 50px}
    }
</style>