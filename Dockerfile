FROM abiosoft/caddy:latest
COPY index.html /srv
COPY Caddyfile /etc/Caddyfile
EXPOSE 80
