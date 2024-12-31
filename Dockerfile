LABEL org.opencontainers.image.source https://github.com/daveio/webdummy
FROM caddy:2.8.4-alpine
LABEL maintainer "Dave Williams <dave@dave.io>"
COPY Caddyfile /etc/caddy/Caddyfile
COPY html /srv
COPY html/404.html /srv/index.html
WORKDIR /srv
EXPOSE 8000
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
