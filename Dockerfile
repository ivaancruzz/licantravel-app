# Etapa de construcción
FROM node:20.13.1-alpine3.19 AS build

ARG NGX_ENV=local
ARG NGX_MP_PUBLIC_KEY
ARG NGX_PANEL_URL
ARG NGX_SUPABASE_URL
ARG NGX_SUPABASE_ANON_KEY
ARG NGX_STORAGE_RESOURCES
ARG NGX_TURNSTILE_KEY

ENV NGX_ENV=$NGX_ENV \
    NGX_MP_PUBLIC_KEY=$NGX_MP_PUBLIC_KEY \
    NGX_PANEL_URL=$NGX_PANEL_URL \
    NGX_SUPABASE_URL=$NGX_SUPABASE_URL \
    NGX_SUPABASE_ANON_KEY=$NGX_SUPABASE_ANON_KEY \
    NGX_STORAGE_RESOURCES=$NGX_STORAGE_RESOURCES \
    NGX_TURNSTILE_KEY=$NGX_TURNSTILE_KEY

WORKDIR /app/src
COPY package*.json ./
RUN npm ci
COPY . ./

# Solo build para development y production
RUN if [ "$NGX_ENV" != "local" ]; then npm run build; fi

# Etapa para entorno local con live reload
FROM node:20.13.1-alpine3.19 AS local
WORKDIR /app/src
COPY --from=build /app/src ./
EXPOSE 4200
CMD ["npm", "run", "start"]

# Etapa para entornos development y production
FROM node:20.13.1-alpine3.19 AS final
RUN addgroup -S exampleusergroup && adduser -S exampleuser -G exampleusergroup
USER exampleuser
WORKDIR /usr/app
COPY --from=build /app/src/dist/licantravel-app/ ./
CMD ["node", "server/server.mjs"]
EXPOSE 4000
