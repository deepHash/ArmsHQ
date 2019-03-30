const express = require('express'),
      bodyParser = require('body-parser'),
      http = require('http'),
      cors = require('cors'),
      serialPort = require('./controllers/serialPort'),
      redis = require('./database'),
      app = express(),
      port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', port);

//origin headers
app.use(cors());

const server = http.createServer(app),
      io = require('socket.io')(server);

io.on('connection', socket => {
    console.log("client connected to socket");
    
    universalEmitter.on('RFMessage', (soldier) =>{
        console.log(soldier);
        socket.emit('gps', {data: soldier});
    });

    universalEmitter.on('Emergency', (soldier) =>{
        socket.emit('emergency', {emerg: true, soldierId: soldier.data.soldierId});
    });
    
    socket.on('disconnect', () => {
        console.log("client disconnected from socket");
    })
});

//error 404 route
app.all('*', (req, res) => {
    res.send(`error: route not found, global handler`);
});


server.listen(port, () => {
        console.log(`listening on port ${port}`);
});