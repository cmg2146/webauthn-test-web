<template>
  <div>
    <v-row justify="center" align="start">
      <v-col cols="12" class="d-flex justify-center">
        <h2>Create an account for WebAuthn-Test</h2>
      </v-col>
    </v-row>
    <v-row justify="center" align="start">
      <v-col cols="12" md="6" lg="5" class="d-flex flex-column align-stretch">
        <v-card
          class="pa-5"
        >
          <v-form
            ref="registerForm"
            @submit.prevent="onContinueRegistration"
          >
            <v-card-text>
              <v-text-field
                v-model="displayName"
                :rules="[nameRules.required, nameRules.max]"
                name="displayName"
                label="Username/Account Name"
                class="mb-3"
                outlined
              />
              <v-text-field
                v-model="firstName"
                :rules="[nameRules.required, nameRules.max]"
                name="displayName"
                label="First Name"
                class="mb-3"
                outlined
              />
              <v-text-field
                v-model="lastName"
                :rules="[nameRules.required, nameRules.max]"
                name="displayName"
                label="Last Name"
                class="mb-3"
                outlined
              />
              <div>
                When clicking "Continue" below, you will be prompted to create a
                credential on a device of your choice. You can select your current device
                or an external device like a phone, if you're using your computer, or security key.
              </div>
              <v-btn
                block
                color="primary"
                :loading="registering"
                :disabled="registering"
                class="mt-5"
                type="submit"
              >
                Continue
              </v-btn>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" align="start">
      <v-col cols="12" md="6" lg="5" class="d-flex flex-column align-stretch">
        <v-alert
          v-model="registrationError"
          color="error"
          class="pa-5"
        >
          {{ registrataionErrorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { startRegistration } from '@simplewebauthn/browser';

export default {
  name: 'RegisterPage',
  auth: 'guest',
  data () {
    return {
      registering: false,
      registrationError: false,
      registrataionErrorMessage: '',
      displayName: '',
      firstName: '',
      lastName: '',
      nameRules: {
        required: value => !!value || 'Required.',
        max: v => v.length <= 255 || 'Max 255 characters'
      }
    };
  },
  methods: {
    onContinueRegistration () {
      if (this.$refs.registerForm.validate()) {
        this.registering = true;
        this.registrationError = false;

        const user = {
          displayName: this.displayName,
          firstName: this.firstName,
          lastName: this.lastName
        };

        return this
          .$axios
          // retrieve registration options/challenge first
          .$post('/api/webauthn/signup-start', user)
          // then start attestation ceremony
          .then(createOptions => startRegistration(createOptions))
          // then try to register credential from the authenticator response and login the user
          .then((attestationResponse) => {
            return this
              .$auth
              .loginWith(
                'cookie', {
                  url: '/api/webauthn/signup-finish',
                  method: 'post',
                  data: attestationResponse
                }
              );
          })
          .catch((error) => {
            this.registering = false;
            this.registrationError = true;
            this.registrataionErrorMessage = error;
          });
      }
    }
  }
};
</script>
