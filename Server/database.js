//--------------------------------Connect to mongodb on main DB via Mongoose--------------------------------//
const mongoose = require('mongoose');
      mongoose.Promise = global.Promise;
//The server option auto_reconnect is defaulted to true
var options = {
    auto_reconnect: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true
};

//-----------------------------------------------Test || Production-----------------------------------------//
var production_env = false;

function getDB(production){
    if (production)
        mongoose.connect('mongodb://localhost:27017/arms', options);
    
    else
        mongoose.connect('mongodb://db_user:Arms123@ds237748.mlab.com:37748/arms', options);
}
//

getDB(production_env);
const conn = mongoose.connection;//get default connection

// Event handlers for Mongoose
conn.on('error', function (err) {
    console.log('Mongoose: Error: ' + err);
});
conn.on('open', function() {
    console.log('Mongoose: Connection established');
});
conn.on('disconnected', function() {
    console.log('Mongoose: Connection stopped, reconnect');
    getDB(production_env);
});
conn.on('reconnected', function () {
    console.info('Mongoose reconnected!');
});
