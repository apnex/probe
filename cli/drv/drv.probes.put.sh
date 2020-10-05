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
	local STATUS="${3}"
	read -r -d "" BODY <<-EOF
	{
		"name": "${NAME}",
		"endpoint": "${ENDPOINT}",
		"status": "${STATUS}"
	}
	EOF
	printf "${BODY}"
}

# apiGet
apiPut() {
	local URL="${1}"
	local BODY="${2}"
	local RESPONSE=$(curl -s -X PUT \
		-H "Content-Type: application/json" \
		-d "${BODY}" \
	"${URL}")
}

# run
run() {
	URL="${APIHOST}"
	if [[ -n "${1}" && -n "${2}" && -n "${3}" ]]; then
		local BODY=$(makeBody "${1}" "${2}" "${3}")
		URL+="/${ITEM}/${1}"
		printf "[$(cgreen "INFO")]: api [$(cgreen "list")] ${ITEM} [$(cgreen "${URL}")]... " 1>&2
		echo "[$(ccyan "DONE")]" 1>&2
		echo "${BODY}"
		apiPut "${URL}" "${BODY}"
	else
		echo "[$(corange "ERROR")]: command usage: [$(ccyan " probes.put <probe.name> <probe.endpoint> <probe.status> ")] " 1>&2
	fi
}

# driver
driver "${@}"
