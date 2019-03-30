const SerialPort = require('serialport'),
      EventEmitter = require('events'),
      portName = process.argv[2],
      Readline = require('@serialport/parser-readline'),
      redis = require('../database'),
      port = new SerialPort(portName, { baudRate: 115200 }),
      parser = port.pipe(new Readline()); 

//global shared event emitter
global.universalEmitter = new EventEmitter();

    let soldier = {
        msgID: Number,
        soldierID: Number,
        data: String
    }

    //open arduino connection and receive data
    port.on('open', () => {
        console.log("Serial Connection is opened to RF");
    });

    //receving data from port
    parser.on('data', (data) => {
        if(data.includes("<NEW_MSG>")){
            data.split(',').forEach((row)=>{
                if(row.includes("<MSG_ID>"))
                    soldier.msgID = parseInt(row.substring(9));
                if(row.includes("<SRC>"))
                    soldier.soldierID = parseInt(row.substring(6));
                if(row.includes("<DATA>")){
                    if(row.includes("G:")){
                        soldier.data = {
                            gps:{
                                lan: parseFloat(row.split(':')[1]),
                                lat: parseFloat(row.split(':')[2])
                            }
                        } 
                        redis.lpush("Sold::"+soldier.soldierID+"::GPS","Time:"+soldier.msgID+"|"+JSON.stringify(soldier.data.gps));
                    }
                    if(row.includes("E:")){
                        solder.data = {
                            emerg: true
                        }
                        universalEmitter.emit('Emergency', soldier);
                    }
                    //ToDo add all switch cases
                }
        
            });
        }
        //console.log(soldier);
        universalEmitter.emit('RFMessage', soldier);
    })

    //error from port
    port.on('error', (err) =>{
        console.log("ERROR:" + err);
    })


