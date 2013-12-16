/**
 * Created by matt on 12/2/13.
 */

const EventEmitter = require('events').EventEmitter;
const redis  = require('redis');

var worker = function(config) {
  var self = this;
  self.host = config['redis']['host'];
  self.port = config['redis']['port'];
  self.running = false;
  self.working = false;
  self.queue = config['namespace'];

  self.connection = redis.createClient(self.port, self.host);
};

worker.prototype.start = function() {
  var self = this;
  self.emit('start');
  self.poll();
};

worker.prototype.poll = function() {
  var self = this;
  //self.emit('poll');
  self.connection.redis.lpop(self.queue, function(err, resp) {
    if (!err && resp) {
      var logline = JSON.parse(resp.toString());
      console.log("logline: " + logline);

      process.nextTick(function() {
        self.poll();
      });
    }
  });
};

exports.worker = worker;