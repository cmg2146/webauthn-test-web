<template>
  <v-app>
    <v-main>
      <v-container class="px-10 pt-10">
        <AppHeader />
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
    };
  }
};
</script>
