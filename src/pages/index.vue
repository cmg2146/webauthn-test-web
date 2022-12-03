<template>
  <div>
    <v-row justify="center" align="start" class="mb-5">
      <v-col cols="12" md="7" class="d-flex align-center">
        <v-avatar
          color="primary"
          size="75"
          class="mr-5 text-h5"
        >
          {{ userInitials }}
        </v-avatar>
        <div>
          <div class="font-weight-bold text-h5">
            {{ user.firstName }} {{ user.lastName }}
          </div>
          <div class="text-h6">
            {{ user.displayName }}
          </div>
        </div>

        <v-spacer />

        <v-btn
          text
          @click="onLogoutClick"
        >
          <v-icon>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="start">
      <v-col cols="12" md="7" class="d-flex flex-column align-stretch">
        <UserLoginDevicesCard />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data () {
    return {
      user: {
        firstName: this.$auth.user.firstName,
        lastName: this.$auth.user.lastName,
        displayName: this.$auth.user.displayName
      }
    };
  },
  compute: {
    userInitials () {
      return this.user.firstName.charAt(0) + this.user.lastName.charAt(0);
    }
  },
  methods: {
    onLogoutClick () {
      this.$auth.logout();
    }
  }
};
</script>
