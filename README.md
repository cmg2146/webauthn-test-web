# WebAuthn Test Web
This repo contains the frontend for the WebAuthn-Test application. The complete application
is nothing more than a basic example of passwordless and usernameless authentication with WebAuthn.

## Application Structure
The complete application contains two parts:

1. A web API ([webauthn-test-api](https://github.com/cmg2146/webauthn-test-api))
2. Frontend (this repo)

The frontend is implemented as a static web site using Vue.js and Nuxt.

In production and development, the API and frontend are hosted separately, but requests to the API are
proxied by the frontend server. This design allows Strict cookies to be used for authentication.
In production, Nginx is used to serve the frontend and proxy requests to the API.

The frontend Vue app was created with the following npm command:

```npm init nuxt-app@latest webauthn-test-web```

## Build
For development, first clone the [webauthn-test-api](https://github.com/cmg2146/webauthn-test-api) repo and then
start the API (consult the repo Readme to learn how to start it). Once the API is running, the frontend can
be run using Docker Linux containers by executing the following command at the repo root:

```docker-compose up```

...and then opening your browser to https://localhost:10000.

If your browser warns the site is unsafe, trust the development certificate on your machine to avoid the warning again.
The app requires HTTPS, even in development, because it is a requirement for WebAuthn. The development certificate
was created using the `dotnet dev-certs https` CLI command and must not be used in production!

The startup order only matters for development. In production, the services can be started in any order.

In production, an Azure DevOps pipeline (azure-pipelines.yml) automatically runs when changes are made to the main branch.
The pipeline requires the following variables to be configured to properly deploy the updated code:

* AZURE_SERVICE_CONNECTION
  * The name of the service connection to Azure. A service connection must be created in Azure DevOps
  for the pipeline to communicate with Azure.
* CONTAINER_REGISTRY_SERVICE_CONNECTION
  * The name of the service connection to the Azure Container Registry (ACR). Docker images are pushed to this ACR.
  A service connection must be created in Azure DevOps for the pipeline to communicate with the ACR.
* CONTAINER_REGISTRY_NAMESPACE
  * The host name of the container registry, for example "{your acr name}.azurecr.io"
* CONTAINER_IMAGE_REPOSITORY
  * The name of the Docker image, for example "webauthn-test/web"
* APP_NAME
  * The name of the Azure App Service that hosts the web frontend.

Currently, the variables above are set in a variable group in Azure DevOps.

### Configuration
The following build-time environment variables must be configured for proper operation:

* NODE_ENV
  * "development" or "production"

The following run-time environment variables must be configured for proper operation:
* API_URL
  * The URL to the API, i.e. http://localhost:10001. This is only needed by the reverse
  proxy.

For development, all environment variables have already been set in the docker compose file and can
be tweaked as needed. Some other environment variables, not listed above, are required for development and
have also been set in the docker-compose file.

In production, the variables are set in a variable group in Azure DevOps.

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

* TODO: Upgrade to Nuxt/Vue 3. upgrade to Typescript.
* TODO: Try out composition API.
* TODO: get rid of startup order requirements in dev.
