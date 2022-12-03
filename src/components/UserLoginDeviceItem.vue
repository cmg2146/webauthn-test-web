<template>
  <v-list-item two-line>
    <v-list-item-icon>
      <v-icon>{{ getIconNameForCredential(credential) }}</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{ credential.displayName }}</v-list-item-title>
      <v-list-item-subtitle v-if="isActive" class="mt-2">
        <v-chip color="primary" small>
          Logged in
        </v-chip>
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-menu bottom left>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="$emit('delete', credential)">
            <v-list-item-icon color="error">
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  name: 'UserLoginDeviceItem',
  props: {
    credential: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete'],
  data () {
    return {};
  },
  methods: {
    getIconNameForCredential (credential) {
      const attFmt = credential.attestationFormatId;

      if (attFmt === 'tpm') {
        return 'mdi-laptop';
      } else if (
        attFmt === 'android-key' ||
        attFmt === 'android-safetynet' ||
        attFmt === 'apple'
      ) {
        return 'mdi-cellphone';
      }

      return 'mdi-usb-flash-drive';
    }
  }
};
</script>
