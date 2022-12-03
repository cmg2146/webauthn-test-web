<template>
  <v-card
    class="pa-0"
  >
    <v-card-title class="justify-center px-10 py-5">
      Login Devices
    </v-card-title>

    <v-divider />

    <v-card-text
      v-if="errorLoadingCredentials"
      class="text-center py-10"
    >
      There was an error loading your device list
    </v-card-text>

    <v-card-text
      v-else-if="!loadingCredentials && !credentials.length"
      class="text-center py-10"
    >
      You don't have any devices to log in with.
      Click below to add a device.
    </v-card-text>

    <v-card-text
      v-else
      class="pa-0"
    >
      <v-fade-transition>
        <v-overlay
          absolute
          :value="loadingCredentials"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </v-overlay>
      </v-fade-transition>

      <div
        v-for="credential in credentials"
        :key="credential.id"
      >
        <UserLoginDeviceItem
          :credential="credential"
          :is-active="credential.id === activeCredentialId"
          class="px-10 py-5"
          @delete="confirmingDeleteCredential = true"
        />

        <v-dialog
          v-model="confirmingDeleteCredential"
          max-width="350"
        >
          <v-card>
            <v-card-title class="text-h5">
              Confirm Deletion
            </v-card-title>
            <v-card-text>
              Are you sure you want to delete this device?
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="confirmingDeleteCredential = false"
              >
                No
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="onDeleteCredential(credential)"
              >
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="d-flex justify-center px-10 py-5">
      <v-btn
        text
        block
        :loading="registering"
        :disabled="registering"
        @click="onAddDevice"
      >
        <v-icon>mdi-plus</v-icon>
        Add device
      </v-btn>
    </v-card-actions>

    <v-snackbar
      :value="registrationError"
      color="error"
      bottom
    >
      Error adding device: {{ registrationErrorMessage }}
    </v-snackbar>

    <v-snackbar
      :value="errorDeletingCredential"
      color="error"
      bottom
    >
      Error deleting device: {{ credentialDeletionErrorMessage }}
    </v-snackbar>
  </v-card>
</template>

<script>
import { startRegistration } from '@simplewebauthn/browser';

export default {
  name: 'UserLoginDevicesCard',
  data () {
    return {
      registering: false,
      registrationError: false,
      registrationErrorMessage: '',
      loadingCredentials: true,
      errorLoadingCredentials: false,
      errorDeletingCredential: false,
      credentialDeletionErrorMessage: '',
      credentials: [],
      activeCredentialId: null,
      confirmingDeleteCredential: false
    };
  },
  mounted () {
    this.loadCredentials();
    this.loadActiveCredential();
  },
  methods: {
    loadCredentials () {
      this.loadingCredentials = true;
      this.errorLoadingCredentials = false;

      return this
        .$axios
        .$get('/api/users/me/credentials')
        .then((credentials) => {
          this.credentials = credentials;
          this.loadingCredentials = false;
        })
        .catch(() => {
          this.loadingCredentials = false;
          this.errorLoadingCredentials = true;
        });
    },
    loadActiveCredential () {
      return this
        .$axios
        .$get('/api/users/me/credentials/current')
        .then((credential) => {
          this.activeCredentialId = credential.id;
        })
        .catch(() => {});
    },
    onAddDevice () {
      this.registering = true;
      this.registrationError = false;
      this.registrationErrorMessage = '';

      return this
        .$axios
        // retrieve registration options/challenge first
        .$get('/api/webauthn/register')
        // then start attestation ceremony
        .then(createOptions => startRegistration(createOptions))
        // then try to register credential from the authenticator response
        .then((attestationResponse) => {
          return this
            .$axios
            .$post('/api/webauthn/register', attestationResponse);
        })
        // then update the device list if successful registration
        .then((createResult) => {
          this.registering = false;
          this.loadCredentials();
          return true;
        })
        .catch((error) => {
          this.registering = false;
          this.registrationError = true;
          this.registrationErrorMessage = error;
        });
    },
    onDeleteCredential (credential) {
      this.loadingCredentials = true;
      this.errorDeletingCredential = false;
      this.confirmingDeleteCredential = false;

      return this
        .$axios
        .$delete(`/api/users/me/credentials/${credential.id}`)
        .then(() => {
          this.loadCredentials();
          return true;
        })
        .catch((error) => {
          this.loadingCredentials = false;
          this.errorDeletingCredential = true;
          this.credentialDeletionErrorMessage = error;
        });
    }
  }
};
</script>
