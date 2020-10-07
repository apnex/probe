#!/bin/bash

# parameters
SERVICENAME="probe"
IMAGENAME="probe"

# launch & persist
docker rm -v $(docker ps -qa -f name="${SERVICENAME}" -f status=exited) 2>/dev/null
RUNNING=$(docker ps -q -f name="${SERVICENAME}")
if [[ -z "$RUNNING" ]]; then
	printf "[apnex/${SERVICENAME}] not running - now starting\n" 1>&2
	docker run -d -P --net host \
		--name "${SERVICENAME}" \
	"apnex/${IMAGENAME}"
fi
