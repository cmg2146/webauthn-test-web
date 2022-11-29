# WebAuthn Test UI
This repo contains the front end for the WebAuthn-Test application. The Webauthn-Test
application is simply a basic sample of passwordless and usernameless authentication with WebAuthn.

## Application Structure
The complete application contains two parts:

1. Web API
2. Frontend

The front end is implemented as a static web site using Vue.js and Nuxt.

In production and in development, the web API and front end are hosted separately, but requests to the API are
proxied by the front end server, thus eliminating cross-origin issues and allowing cookies to be used for authentication.
In production, nginx is used to serve the front end and proxy requests to the web API.

The API is available in the webauthn-test-api repo.

The Frontend Vue app was created with the following npm command:

```npm init nuxt-app@latest ./src/ui```

## Build
Make sure the API project is cloned first before continuing. Then, to run the complete solution, start the API before
the frontend. Consult the API repo Readme to learn how to run the API.

Once the API is running, the front end can be run using Docker Linux containers by executing the following command at the repo root:

```docker-compose up```

...and then opening your browser to https://localhost:10000.

If your browser warns you the site is unsafe, you can either "proceed as unsafe" or add the development certificate to
your certificate store to avoid the warning again. This development certificate must not be used in production!
It was created using the `dotnet dev-certs https` CLI command.

### Configuration
The following environment variables must be configured, at build time, for proper operation:

* NODE_ENV
  * "development" or "production"

The following environment variables must be configured, at run time, for proper operation
* API_URL
  * The URL to the server/web API, i.e. http://localhost:10001. This is only needed by the reverse
  proxy - front-end does not know about this URL.

For development, all environment variables have already been set in the docker compose file and can
be tweaked as needed. Some other environment variables, not listed above, are required for development and
have also been set in the docker-compose file.

## Notes

* TODO: Run audit in chrome dev tools
* TODO: Enable Content-Security Policy
* TODO: Secure the login and register page
  * Ensure CSRF is handled properly.
  * Add device registration to register page (this will solve user prescence issue)

## Managing Authenticator Credentials

For Yubikeys, first download the [Yubikey Manager](https://docs.yubico.com/software/yubikey/tools/ykman/intro.html).
In an administrator command prompt, run the following to list all FIDO credentials stored on the key:

```ykman fido credentials list```

To delete a credential, run:

```ykman fido credentials delete nameOfCredential```

For Windows Hello authenticator, you can use the certutil utility.
In an administrator command prompt, run the following command to list all providers:

 `certutil -csplist`

 For each provider run the following command until you see FIDO keys listed.
FIDO keys should look like `sid/guid/FIDO_AUTHENTICATOR//rpIdHash_userId`:

```certutil -csp "The Provider Name" -key```

To delete a key, run:

```certutil -csp "The Provider Name" -delkey nameOfKey```