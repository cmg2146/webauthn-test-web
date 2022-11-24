#TODO:Couldnt get nuxt dev server working with v18 LTS node
FROM node:16-alpine as install-deps

# do dependency installation as separate step for caching
WORKDIR /app
COPY ./package*.json ./
RUN ["npm", "install", "--force"]

#No CMD or entrypoint. In development, docker compose targets this stage and
#specifies the command. In production, we fall through to next stage.


FROM node:16-alpine as generate

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY --from=install-deps /app ./
#copy all the rest of the files needed to build app
COPY ./src ./src
COPY ./config/* ./

RUN ["npm", "run", "generate"]


FROM nginx
COPY --from=generate /app/dist /usr/share/nginx/html
# default config was modified for the api reverse proxy
COPY ./default.conf.template /etc/nginx/templates/default.conf.template