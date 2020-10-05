#!/bin/bash
if [[ $0 =~ ^(.*)/[^/]+$ ]]; then
	WORKDIR=${BASH_REMATCH[1]}
fi
source ${WORKDIR}/mod.driver

# inputs
APIHOST="http://localhost:4040"
ITEM="probes"
INPUTS=()

# apiDelete
apiDelete() {
	local URL="${1}"
	local RESPONSE=$(curl -s -X DELETE \
		-H "Content-Type: application/json" \
	"${URL}")
}

# run
run() {
	URL="${APIHOST}"
	if [[ -n "${1}" ]]; then
		URL+="/${ITEM}/${1}"
		printf "[$(cgreen "INFO")]: api [$(cgreen "list")] ${ITEM} [$(cgreen "${URL}")]... " 1>&2
		echo "[$(ccyan "DONE")]" 1>&2
		apiDelete "${URL}"
	else
		echo "[$(corange "ERROR")]: command usage: [$(ccyan " probes.delete <probeName> ")] " 1>&2
	fi
}

# driver
driver "${@}"
