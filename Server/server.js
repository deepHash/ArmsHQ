const express     = require('express'),
      bodyParser  = require('body-parser'),
      http        = require('http'),
      cors        = require('cors'),
      serialPort  = require('./controllers/serialPort'), //for event emitter
      SoldierController = require('./controllers/SoldierController'),
      AlertController   = require('./controllers/AlertController'),
      soldierData       = SoldierController(),
      alertData         = AlertController(),
      app         = express(),
      port        = process.env.PORT || 4000;

//TEST VARS
var   test        = false;
//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', port);

//origin headers
app.use(cors());

//GET request for all soldiers
app.get('/getAllSoldiers', (req, res, next) => {
    soldierData.getAllSoldiers().then((result) => {
        res.status(200).json(result);
    }, (error) => {
      console.log(error);
      next();
    });
});

//GET request for a spesific solder by ID
app.get('/getSoldierByID/:id', (req, res, next) => {
    soldierData.getSoldierByID(req.params.id).then((result, error) => {
        res.status(200).json(result);
    }, (error) => {
        console.log(error);
        next();
    });
});

//GET request to get ALL alerts recieved so far
app.get('/getAllAlerts', (req, res, next) => {
    alertData.getAllAlerts().then((result) => {
        res.status(200).json(result);
    }, (error) => {
      console.log(error);
      next();
    });
});

const server = http.createServer(app),
      io = require('socket.io')(server);

io.on('connection', socket => {
    console.log("client connected to socket");
    
    data.getAll().then((result) => {
        //console.log(result);
        socket.emit('initData',{soldiers: result});
    })

    //---------------------------------------TEST-----------------------------------------------//
    if (test) {
        setTimeout(function () {
            console.log('boo')
            socket.emit('emergency', {emerg: true, soldierName: "Tal", meshID: 10});
          }, 100)
          var end = Date.now() + 3000
          while (Date.now() < end);
    }
    //---------------------------------------------------------------------------------------------
    
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
