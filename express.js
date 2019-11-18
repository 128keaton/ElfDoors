/**
 * Server.JS
 * Copyright 2019 Keaton Burleson
 */

// Load .env into process.env
require('dotenv').config();

// Get dependencies
const signale = require('signale');
const burly = require('kb-burly').Burly;
const express = require('express');
const path = require('path');
const http = require('http');
const request = require('request');
const figlet = require('figlet');
const packageInfo = require('./package');
const bodyParser = require('body-parser');
const fs = require('fs');

// Configure logger
signale.config({
  displayTimestamp: true,
  displayDate: true
});

// Get environment variables
const port = process.env.PORT || '80';
const intelliURL = process.env.INTELLI_ENDPOINT || 'http://localhost';
const intelliUsername = process.env.INTELLI_USERNAME || 'admin';
const intelliPassword = process.env.INTELLI_PASSWORD || 'admin';
const mapSavePath = __dirname + '/public/map.json';

// Create root objects
const app = express();

// Configure express app
app.set('port', port);

// Enable the body-parser middleware
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies

// Add CORS header to any request
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Pipe API requests to the intelli-m server
app.use('/api', function (req, res) {
  const requestEndpoint = req.url.replace('/api', '');

  const url = burly(intelliURL)
    .addSegment(requestEndpoint)
    .addQuery('username', intelliUsername)
    .addQuery('password', intelliPassword)
    .get;

  let apiRequest = request(url);
  if (process.env.LOG_REQUESTS) {
    signale.debug(`Requesting URL ${url}`);
  }

  apiRequest.on("response", function () {
    apiRequest.pipe(res);
    apiRequest.resume();
  }).on("error", function (err) {
    signale.error(err);
  });
});

// POST and save the map save file JSON
app.post('/save/map', function (req, res) {
  fs.writeFile(mapSavePath, JSON.stringify(req.body), function () {
    res.send(req.body);
  });
});

// Return the map save file JSON
app.get('/get/map', function (req, res) {
  fs.readFile(mapSavePath, (err, data) => {
    if (err) {
      signale.error('No map file found at path: ' + mapSavePath);
      res.send({});
    }

    res.send(data);
  });
});

// Use express to host the Angular build output
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Create the server
http.createServer(app).listen(port, () => figlet(packageInfo.name, function (err, data) {
  if (!err) {
    console.log('===========================================');
    console.log(data);
    console.log('===========================================');
    signale.info(`Version: ${packageInfo.version}`);
    signale.success(`Available at http://localhost:${port}`);
  }
}));
