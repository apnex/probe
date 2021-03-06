FROM alpine AS build
LABEL stage=intermediate

RUN mkdir -p /root/probe
COPY lib /root/probe
WORKDIR "/root/probe"
RUN	apk --no-cache add \
	git \
	nodejs \
	nodejs-npm \
	&& npm install npm@latest --global
RUN	npm install

FROM alpine
ENV PROBE_SERVER_PORT=4040
EXPOSE 4040
COPY --from=build /root/probe /root/probe
RUN	apk --no-cache add \
		nodejs \
		bash \
		util-linux \
		curl \
		jq \
	&& ln -s /root/probe/cli/mod.command /usr/bin/cli
COPY probe-cli /root/
COPY entry.sh /root/
ENTRYPOINT ["/root/entry.sh"]
