const express = require('express'),
      bodyParser = require('body-parser'),
      EventEmitter = require('events'),
      serialPort = require('./controllers/serialPort'),
      redis = require('./database'),
      app = express(),
      port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', port);

//origin headers
app.use(
    (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept");
        res.set("Content-Type", "application/json");
        next();
    });

//error 404 route
app.all('*', (req, res) => {
    res.send(`error: route not found, global handler`);
});

app.listen(port, () => {
        console.log(`listening on port ${port}`);
});

//RFCommunication
universalEmitter.on('RFMessage', (data) =>{
    console.log(data);
});

