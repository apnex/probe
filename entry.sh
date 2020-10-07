#!/bin/sh

function start {
	/root/probe/server.js
}

case ${1} in
	shell)
		cat /root/probe-cli
	;;
	complete)
		#cat /root/probe.complete
		echo "No complete file defined"
	;;
	*)
		start
	;;
esac
