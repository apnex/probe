#!/bin/bash

read -r -d "" PROBES <<-EOF
	https://www.google.com
	http://localhost:4041/data
	http://localhost:4042/data
	https://labops.sh
EOF

IFS=$'\n'
COUNT=0
for PROBE in ${PROBES}; do
	./cmd.probes.create.sh probe${COUNT} "${PROBE}"
	COUNT=$((COUNT+1))
done

