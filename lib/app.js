#!/usr/bin/env node
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const os = require("os");

var data = [];
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// join a probe
app.post('/probes', (req, res) => {
	console.log('[ POST ] /join');
	console.log(JSON.stringify(req.body, null, "\t"));
	let name = req.body.name;
	data.forEach((item) => {
		if(item.name == name) {
			console.log('NAME: ' + name + ' exists!!');
		}
	});
	data.push({
		name: req.body.name,
		endpoint: req.body.endpoint,
		status: "unknown"
	});
	res.status(200).send(data);
});

app.get('/probes', (req, res) => {
	console.log('[ GET ] /probes');
	var hostname = os.hostname();
	let items = {
		server: {
			name: hostname,
			address: req.headers.host
		},
		items: data
	};
	res.status(200).send(items);
});

app.get('/probes/:probeName', (req, res) => {
	let probeName = req.params.probeName;
	console.log('[ GET ] /probes/' + probeName);
	let probe = data.filter((item) => {
		return (item.name == probeName);
	})[0];
	res.status(200).send(probe);
});

app.put('/probes/:probeName', (req, res) => {
	let probeName = req.params.probeName;
	console.log('[ PUT ] /probes/' + probeName);
	data.forEach((item) => {
		if(item.name == probeName) {
			item = Object.assign(item, req.body);
		}
	});
	res.status(200).send({
		message: "Updated.. "
	});
});

app.delete('/probes/:probeName', (req, res) => {
	let probeName = req.params.probeName;
	console.log('[ DELETE ] /probes/' + probeName);
	data = data.filter((item) => {
		return (item.name != probeName);
	}); // remove
	res.status(200).send({
		message: "probe [ " + probeName + " ] deleted"
	});
});

app.get('/favicon.ico', (req, res) => {
	res.status(200).send({});
});

// Serve static html files
app.use('/', express.static(path.join(__dirname, 'html')))

module.exports = app;
