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

  self.connection = redis.createClient(self.port, self.host);
};

worker.prototype.start = function() {
  var self = this;
  //self.emit('start');
  self.poll();
};

/*worker.prototype.end = function(callback) {
  var self = this;
  self.running = false;
  if (self.working == true){
    setTimeout(function(){
      self.end(callback);
    }, self.options.timeout);
  }else{
    self.emit('end');
    self.untrack(self.name, self.stringQueues(), function(){
      if(typeof callback == "function"){ callback(); }
    });
  }
};*/

worker.prototype.poll = function() {
  var self = this;
  self.emit('poll', self.queue);
  self.connection.redis.lpop('logdriver:beaver', function(err, resp) {
    if (!err && resp) {
      var logline = JSON.parse(resp.toString());

      process.nextTick(function() {
        self.poll(nQueue + 1);
      });
    }
  });
};

exports.worker = worker;