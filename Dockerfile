FROM abiosoft/caddy:builder as caddybuilder
RUN go get -v github.com/abiosoft/parent
RUN GO111MODULE="on" VERSION="1.0.3" PLUGINS="git,cors,realip,expires,cache,cloudflare" ENABLE_TELEMETRY="true" /bin/sh /usr/bin/builder.sh

FROM alpine:latest
LABEL maintainer "Dave Williams <dave@dave.io>"
RUN apk upgrade --update --no-cache && apk add --update --no-cache \
  ca-certificates \
  git \
  mailcap \
  openssh-client \
  tzdata
COPY --from=caddybuilder /go/bin/parent /bin/parent
COPY --from=caddybuilder /install/caddy /usr/bin/caddy
COPY Caddyfile /etc/Caddyfile
COPY html /srv
COPY html/404.html /srv/index.html
WORKDIR /srv
ENTRYPOINT ["/bin/parent", "caddy"]
CMD ["--conf", "/etc/Caddyfile", "--log", "stdout", "--agree=true"]
EXPOSE 80
