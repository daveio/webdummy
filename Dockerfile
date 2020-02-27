FROM abiosoft/caddy:builder AS caddybuildersrc
# doing the builder's job manually due to ed25519 issues in golang 1.12

FROM golang:1.14-alpine3.11 AS caddybuilder
RUN apk add --no-cache \
	git=2.24.1-r0 \
	gcc=9.2.0-r3 \
	musl-dev=1.1.24-r0
RUN go get -v github.com/abiosoft/parent
COPY --from=caddybuildersrc /usr/bin/builder.sh /usr/bin/builder.sh
RUN GO111MODULE="on" VERSION="1.0.4" PLUGINS="git,cors,realip,expires,cache,cloudflare" ENABLE_TELEMETRY="true" /bin/sh /usr/bin/builder.sh

FROM alpine:3.11.3
LABEL maintainer "Dave Williams <dave@dave.io>"
RUN apk add --no-cache \
	ca-certificates=20191127-r1 \
	git=2.24.1-r0 \
	mailcap=2.1.48-r0 \
	openssh-client=8.1_p1-r0 \
	tzdata=2019c-r0
COPY --from=caddybuilder /go/bin/parent /bin/parent
COPY --from=caddybuilder /install/caddy /usr/bin/caddy
COPY Caddyfile /etc/Caddyfile
COPY html /srv
COPY html/404.html /srv/index.html
WORKDIR /srv
ENTRYPOINT ["/bin/parent", "caddy"]
CMD ["--conf", "/etc/Caddyfile", "--log", "stdout", "--agree=true"]
EXPOSE 80
