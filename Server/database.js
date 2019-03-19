const redis = require("redis"),
      client = redis.createClient();

//open redis connection
client.on('connect', function() {
    console.log('Redis client connected');
});
//on redis error
client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

module.exports = client;