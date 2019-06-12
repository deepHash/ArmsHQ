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

app.post('/addSoldier/', (req, res, next) => {
    soldierData.addSoldier(req.body).then((result) => {
        result.length === 0 ? next() : res.status(200).json(result);
    }, (error) => {
        console.log(error);
        next();
    })
});

/**              TESTING         */
app.get('/sendhelp/:id', (req, res) => {
    let soldier = {emerg: true, meshID: req.params.id};
    universalEmitter.emit('Emergency', soldier);
    res.status(200).json([]);
});

app.get('/sendDisconnect/:id', (req, res) => {
    let soldier = {emerg: true, meshID: req.params.id};
    universalEmitter.emit('DISCONNECTED', soldier);
    res.status(200).json([]);
});



//error 404 route
app.all('*', (req, res) => {
    res.send(`error: route not found, global handler`);
});

const server = http.createServer(app),
      io = require('socket.io')(server);

io.on('connection', socket => {
    console.log("client connected to socket");
    
    //socket emit and DB save for gps
    universalEmitter.on('GPS', (soldier) =>{
        soldierData.updateGPS(soldier).then((result) => {
            if(result){
                socket.emit('gps', {data: result});
            }
            // else
            //     //no such MeshID in DB
            //     console.log(`Error updating gps for ID: ${soldier.meshID}`);
        }, (error) => {
            console.log(error);
        })
    });

    universalEmitter.on('Emergency', (soldier) =>{
        alertData.addNewAlert(soldier).then((error) => {
            console.log(error);
        })
        socket.emit('emergency', {emerg: true, meshID: soldier.meshID, soldierName: soldier.name});
    });
    
    
    universalEmitter.on('ACC', (soldier) =>{
        soldierData.updateAcc(soldier).then((result) => {
            if(result){
                socket.emit('acc', {data: result});
            }
            // else
            // //no such MeshID in DB
            // console.log(`Error updating acc for ID: ${soldier.meshID}`);
        }, (error) => {
            console.log(error);
        })
    });
    
    universalEmitter.on('PULSE', (soldier) =>{
        soldierData.updatePulse(soldier).then((result) => {
            if(result){
                socket.emit('pulse', {data: result});
            }
            // else
            //     //no such MeshID in DB
            //     console.log(`Error updating pulse for ID: ${soldier.meshID}`);
            }, (error) => {
                console.log(error);
            })
        });
    
    //emits if soldier has not sent a message for more than 60 seconds
    universalEmitter.on('DISCONNECTED', (soldier) => {
        console.log("going to emit a disconnect message");
        socket.emit('disconnected', {data: soldier})
    });
    
    socket.on('disconnect', () => {
        console.log("client disconnected from socket");
    })
});

server.listen(port, () => {
        console.log(`listening on port ${port}`);
});
