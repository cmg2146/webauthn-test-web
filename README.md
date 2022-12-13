# WebAuthn Test UI
This repo contains the front end for the WebAuthn-Test application. The complete application
is nothing more than a basic example of passwordless and usernameless authentication with WebAuthn.

## Application Structure
The complete application contains two parts:

1. Web API
2. Frontend

The frontend is implemented as a static web site using Vue.js and Nuxt.

In production and development, the web API and frontend are hosted separately, but requests to the API are
proxied by the frontend server. This design allows Strict cookies to be used for authentication.
In production, Nginx is used to serve the frontend and proxy requests to the API.

The API is available in the `webauthn-test-api` repo.

The frontend Vue app was created with the following npm command:

```npm init nuxt-app@latest webauthn-test-web```

## Build
For development, make sure the API project is cloned first before continuing. Then, to run the complete solution, start the API before
the frontend. Consult the API repo Readme to learn how to start the API.

Once the API is running, the frontend can be run using Docker Linux containers by executing the following command at the repo root:

```docker-compose up```

...and then opening your browser to https://localhost:10000.

If your browser warns the site is unsafe, either "proceed as unsafe" or trust the development certificate on your machine to avoid the
warning again. The development certificate was created using the `dotnet dev-certs https` CLI command and must not be used in
production!

### Configuration
The following environment variables must be configured, at build time, for proper operation:

* NODE_ENV
  * "development" or "production"

The following environment variables must be configured, at run time, for proper operation:
* API_URL
  * The URL to the API, i.e. http://localhost:10001. This is only needed by the reverse
  proxy.

For development, all environment variables have already been set in the docker compose file and can
be tweaked as needed. Some other environment variables, not listed above, are required for development and
have also been set in the docker-compose file.

## Managing Authenticator Credentials

For Yubikeys, first download the [Yubikey Manager](https://docs.yubico.com/software/yubikey/tools/ykman/intro.html).
In an administrator command prompt, run the following to list all FIDO credentials stored on the key:

```ykman fido credentials list```

To delete a credential, run:

```ykman fido credentials delete nameOfCredential```

For Windows Hello authenticator, use the certutil utility.
In an administrator command prompt, run the following command to list all providers:

 `certutil -csplist`

For each provider, run the following command until FIDO keys are listed.
FIDO keys should look like `sid/guid/FIDO_AUTHENTICATOR//rpIdHash_userId`:

```certutil -csp "The Provider Name" -key```

To delete a key, run:

```certutil -csp "The Provider Name" -delkey nameOfKey```

## Notes

* TODO: Setup Application Insights and Logging
* TODO: Add device registration to register page (this will solve user prescence issue)
