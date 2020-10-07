import ky from './ky.min.js';

// Returns a Promise that resolves after "ms" Milliseconds
function sleep(ms) {
	return new Promise((response) => {
		setTimeout(response, ms)
	});
}

async function start() {
	var data = [];
	while(1) { // main loop
		// get status
		checkStatus().then((body) => {
			// render table
			data = body;
			renderTable(body, 1);
		}).catch((err) => {
			console.log(JSON.stringify(data, null, "\t"));
			renderTable(data, 0);
		});

		// sleep
		await sleep(2000);
	}
}

async function checkStatus() {
	return await ky.get('/probes').json();
}

function renderTable(data, healthy) {
	// clear all rows from table
	let table = document.getElementById("probes");
	table.innerHTML = "";

	// create header row
	let cell0 = table.insertRow(0).insertCell(0);
	cell0.innerText = data.server.name + ' - ' + data.server.address;

	// check app health
	let tableborder = document.getElementById("tableborder");
	if(healthy) {
		tableborder.className = 'border-healthy';
		cell0.className = 'header-healthy';
	} else {
		tableborder.className = 'border-broken';
		cell0.className = 'header-broken';
		data.items.forEach((item) => {
			item.status = 'unknown';
		});
	}

	// build tiles
	data.items.forEach((item) => {
		// create a tile
		let div = document.createElement("div"); // create new div
		switch(item.status) {
			case('healthy'):
				div.className = 'healthy';
				break;
			case('broken'):
				div.className = 'broken';
				break;
			default:
				div.className = 'unknown';
				break;
		}
		div.appendChild(buildTile(item));

		// attach to new cell
		let cell = table.insertRow(-1).insertCell(0);
		cell.appendChild(div);
	});
	console.log('data: ', data);
}

function buildTile(probe) {
	let table = document.createElement("table");
	let cell0 = table.insertRow(0).insertCell(0);
	let cell1 = table.insertRow(1).insertCell(0);
	let cell2 = table.insertRow(2).insertCell(0);
	table.className = 'probe';
	cell0.innerText = probe.name;
	cell0.className = 'probe-name';
	cell1.innerText = probe.status;
	cell1.className = 'probe-status';
	cell2.innerText = probe.endpoint;
	cell2.className = 'probe-endpoint';
	return table;
}

start();
