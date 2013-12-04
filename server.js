/**
 * Created by matt on 12/2/13.
 */

const fs     = require('fs');
const nconf  = require('nconf');
const redis  = require('redis');
const worker = require('./lib/worker.js');

const client = redis.createClient();
const queue = 'logdriver:beaver';

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'config.json'
//
nconf.argv()
  .env()
  .file({ file: 'config.json' });

process.on('SIGINT', function() {
  console.log('Got SIGINT exiting.');
  process.exit(1);
});

