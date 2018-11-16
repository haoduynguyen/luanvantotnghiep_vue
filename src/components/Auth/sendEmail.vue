<template>
    <v-content>
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Login</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form method ="POST">
                                <v-text-field prepend-icon="lock" name="password" label="Password confirmation"
                                              id="password" type="password"></v-text-field>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" class="btn btn-xs btn-primary" color="success">Submit</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
    export default {
        name: "hahaha",
        data: () => ({
            drawer: null,
            Login: {

            },
            url: "http://localhost:8000"
        }),
        methods:
            {
            },

        props: {
            source: String
        }
    }
</script>

<style scoped>

</style>