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

// Configure logger
signale.config({
  displayTimestamp: true,
  displayDate: true
});

// Get environment variables
const port = process.env.PORT || '3000';
const intelliURL = process.env.INTELLI_ENDPOINT || 'http://localhost';
const intelliUsername = process.env.INTELLI_USERNAME || 'admin';
const intelliPassword = process.env.INTELLI_PASSWORD || 'admin';

// Create root objects
const app = express();
const appPort = process.env.APP_PORT;

// Configure express app
app.set('port', 3000);

// Add CORS header to any request
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Pipe API requests to the intelli-m server
app.use('/api', function(req, res) {
  const requestEndpoint = req.url.replace('/api', '');

  const url = burly(intelliURL)
    .addSegment(requestEndpoint)
    .addQuery('username', intelliUsername)
    .addQuery('password', intelliPassword)
    .get;

  req.pipe(request(url)).pipe(res);
});

// Use express to host the Angular build output
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Create the server
http.createServer(app).listen(port, () => figlet(packageInfo.name, function(err, data) {
  if (!err) {
    console.log('===========================================');
    console.log(data);
    console.log('===========================================');
    signale.info(`Version: ${packageInfo.version}`);
    signale.success(`ExpressJS backend available at http://localhost:${port}`);
    signale.success(`Angular frontend available at http://localhost:${appPort}`);
  }
}));
