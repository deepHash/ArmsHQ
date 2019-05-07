const express     = require('express'),
      bodyParser  = require('body-parser'),
      http        = require('http'),
      cors        = require('cors'),
      serialPort = require('./controllers/serialPort'), //for event emitter
      SoldierData = require('./controllers/SoldierController'),
      data        = SoldierData(), 
      app         = express(),
      port        = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', port);

//origin headers
app.use(cors());

const server = http.createServer(app),
      io = require('socket.io')(server);

io.on('connection', socket => {
    console.log("client connected to socket");

    data.getAll().then((result) => {
        //console.log(result);
        socket.emit('initData',{soldiers: result});
    })
    
    universalEmitter.on('GPS', (soldier) =>{
        data.updateGPS(soldier).then((result) => {
            socket.emit('gps', {data: result});
        }, (error) => {
            console.log(error);
        })
    });

    universalEmitter.on('Emergency', (soldier) =>{
        console.log("here ", soldier.meshID);
        socket.emit('emergency', {emerg: true, soldierId: soldier.meshID, soldierName: soldier.name});
    });
    
    socket.on('disconnect', () => {
        console.log("client disconnected from socket");
    })
});

server.listen(port, () => {
        console.log(`listening on port ${port}`);
});
