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
      port        = process.env.PORT || 4000,
      server      = http.createServer(app),
      io          = require('socket.io')(server);


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
    emitter.emit('Emergency', soldier);
    res.status(200).json([]);
});

app.get('/sendDisconnect/:id', (req, res) => {
    let soldier = {emerg: true, meshID: req.params.id};
    emitter.emit('DISCONNECTED', soldier);
    res.status(200).json([]);
});


//error 404 route
app.all('*', (req, res) => {
    res.send(`error: route not found, global handler`);
});


io.on('connection', socket => {
    console.log("client connected to socket");
    
    //socket emit and DB save for gps
    emitter.on('GPS', (soldier) =>{
        soldierData.updateGPS(soldier).then((result) => {
            if(result){
                socket.emit('gps', {data: result, type: "gps"});
            }
            // else
            //     //no such MeshID in DB
            //     console.log(`Error updating gps for ID: ${soldier.meshID}`);
        }, (error) => {
            console.log(error);
        })
    });
    
    
    emitter.on('ACC', (soldier) =>{
        soldierData.updateAcc(soldier).then((result) => {
            if(result){
                socket.emit('acc', {data: result, type: "acc"});
            }
            // else
            // //no such MeshID in DB
            // console.log(`Error updating acc for ID: ${soldier.meshID}`);
        }, (error) => {
            console.log(error);
        })
    });
    
    emitter.on('PULSE', (soldier) =>{
        soldierData.updatePulse(soldier).then((result) => {
            if(result){
                socket.emit('pulse', {data: result, type: "pulse"});
            }
            // else
            //     //no such MeshID in DB
            //     console.log(`Error updating pulse for ID: ${soldier.meshID}`);
        }, (error) => {
            console.log(error);
        })
    });
    
    emitter.on('Emergency', (soldier) =>{
        alertData.addNewAlert(soldier).then((error) => {
            console.log(error);
        })
        socket.emit('emergency', {data: soldier, type: "emergency", emerg: true });
    });
    
    //emits if soldier has not sent a message for more than 60 seconds
    emitter.on('DISCONNECTED', (soldier) => {
        console.log(`${soldier.meshID} has been disconnected from the network`);
        socket.emit('disconnected', {data: soldier, type: "disconnect"});
    });
    
    //emits if soldier has reconnected to the network after being disconnected
    emitter.on('RECONNECTED', (soldier) => {
        console.log(`${soldier.meshID} has been reconnected to the network`);
        socket.emit('reconnected', {data: soldier, type: "reconnect"});
    });

    socket.on('disconnect', () => {
        console.log("client disconnected from socket");
    })
});

server.listen(port, () => {
        console.log(`listening on port ${port}`);
});
