#!/bin/bash
if [[ $0 =~ ^(.*)/[^/]+$ ]]; then
	WORKDIR=${BASH_REMATCH[1]}
fi
source ${WORKDIR}/mod.driver

# inputs
APIHOST="http://localhost:4040"
ITEM="probes"
INPUTS=()

# makeBody
makeBody() {
	local NAME="${1}"
	local ENDPOINT="${2}"
	read -r -d "" BODY <<-EOF
	{
		"name": "${NAME}",
		"endpoint": "${ENDPOINT}"
	}
	EOF
	printf "${BODY}"
}

# apiGet
apiPost() {
	local URL="${1}"
	local BODY="${2}"
	local RESPONSE=$(curl -s -X POST \
		-H "Content-Type: application/json" \
		-d "${BODY}" \
	"${URL}")
}

# run
run() {
	URL="${APIHOST}"
	URL+="/${ITEM}"
	if [[ -n "${1}" && -n "${2}" ]]; then
		local BODY=$(makeBody "${1}" "${2}")
		printf "[$(cgreen "INFO")]: api [$(cgreen "list")] ${ITEM} [$(cgreen "${URL}")]... " 1>&2
		echo "[$(ccyan "DONE")]" 1>&2
		echo "${BODY}"
		apiPost "${URL}" "${BODY}"
	else
		echo "[$(corange "ERROR")]: command usage: [$(ccyan " probes.join <probe.name> <probe.endpoint> ")] " 1>&2
	fi
}

# driver
driver "${@}"
