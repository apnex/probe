#!/usr/bin/env node
const got = require('got');
const app = require('./app');
'use strict';

// get environment variable
var port = 80;
if(process.env.PROBE_SERVER_PORT) {
	port = process.env.PROBE_SERVER_PORT;
}

// start server
app.listen(port, () => {
	console.log('Express server listening on port ' + port);
	load(); // start loop
});

// Returns a Promise that resolves after "ms" Milliseconds
function sleep(ms) {
	return new Promise((response) => {
		setTimeout(response, ms)
	});
}

async function load() { // We need to wrap the loop into an async function for this to work
	let i = 0;
	while(1) {
		getProbes().then((data) => {
			data.items.forEach((probe) => {
				got.head(probe.endpoint).then((result) => {
					console.log('[ PROBE ] ' + probe.name + ' | ' + probe.endpoint + ' [ SUCCESS ]');
					setStatus(probe.name, {
						status: 'healthy'
					});
				}).catch((error) => {
					console.log('[ PROBE ] ' + probe.name + ' | ' + probe.endpoint + ' [ FAILURE ]');
					setStatus(probe.name, {
						status: 'broken'
					});
				});
			});
		});
		await sleep(5000);
	}
}

async function setStatus(name, json) {
	let url = 'http://localhost:' + port + '/probes/' + name;
	const {body} = await got.put(url, {
		json,
		responseType: 'json'
	});
	return body;
}

async function getProbes() {
	let url = 'http://localhost:' + port + '/probes';
	const {body} = await got.get(url, {
		responseType: 'json'
	});
	return body;
}
