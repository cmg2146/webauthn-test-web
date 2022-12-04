import fs from 'fs';
import path from 'path';
import colors from 'vuetify/es5/util/colors';

const config = {
  srcDir: 'src/',

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - WebAuthn Test',
    title: 'WebAuthn Test',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    'nuxt-compress'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  eslint: {
    // the file watching doesnt work with docker so lint all files
    lintDirtyModulesOnly: false,
    failOnError: true,
    failOnWarning: true
  },

  router: {
    middleware: ['auth']
  },

  auth: {
    strategies: {
      cookie: {
        // note: cookie name cannot be configured or else auth will not work with http only cookies.
        // Obviously http only cookies are a fundamental requirement. In order for http only to work,
        // autoFetch must be true or the user must be set manually.
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/webauthn/authenticate', method: 'post' },
          logout: { url: '/api/webauthn/logout', method: 'post' },
          user: { url: '/api/users/me', method: 'get' }
        }
      }
    },
    watchLoggedIn: true,
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/'
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      themes: {
        light: {
          primary: colors.blue.base,
          accent: colors.blue.accent1,
          secondary: colors.blue.lighten2,
          info: colors.indigo.accent1,
          warning: colors.orange.accent1,
          error: colors.red.accent1,
          success: colors.green.accent1
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};

if (process.env.NODE_ENV === 'development') {
  // server only used for development because target = static
  config.server = {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'dev-server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'dev-server.pem'))
    }
  };

  // in development, we want to proxy all api requests to the ASP.NET Core app
  config.proxy = {
    '/api/': {
      changeOrigin: false,
      target: process.env.API_URL,
      pathRewrite: {
        '^/api/': ''
      }
    }
  };
}

export default config;
