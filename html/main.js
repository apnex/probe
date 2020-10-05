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
			renderTable(body);
		}).catch((err) => {
			console.log(JSON.stringify(data, null, "\t"));
			data.items.forEach((item) => {
				item.status = 'unknown';
			});
			renderTable(data);
		});

		// sleep
		await sleep(2000);
	}
}

async function checkStatus() {
	return await ky.get('http://localhost:4040/probes').json();
}

function renderTable(data) {
	let table = document.getElementById("probes");

	// remove all rows
	table.innerHTML = "";

	data.items.forEach((item) => {
		// create a cell
		let rowCount = table.rows.length;
		let row = table.insertRow(rowCount);
	        let cell1 = document.createElement("td"); // create new row

		// create a tile
		let div1 = document.createElement("div"); // create new div
		switch(item.status) {
			case('healthy'):
				div1.className = 'healthy';
				break;
			case('broken'):
				div1.className = 'broken';
				break;
			default:
				div1.className = 'unknown';
				break;
		}

		// populate tile
		//div1.innerText = buildTile(item);
		div1.appendChild(buildTile(item));

		// attach to table
		cell1.appendChild(div1);
		row.appendChild(cell1);
		table.appendChild(row);
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
