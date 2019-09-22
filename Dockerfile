FROM node:12-alpine AS builder
COPY . /workspace
WORKDIR /workspace
RUN yarn install && yarn run build

# caddy builder?

FROM abiosoft/caddy:latest
COPY --from=builder /workspace/public /srv
COPY --from=builder /workspace/Caddyfile /etc/Caddyfile
EXPOSE 80
