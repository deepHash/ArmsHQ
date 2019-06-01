const SerialPort = require('serialport'),
      EventEmitter = require('events'),
      portName = process.argv[2],
      Readline = require('@serialport/parser-readline'),
      port = new SerialPort(portName, { baudRate: 115200 }),
      Soldier  = require('../models/Soldier'),
      parser = port.pipe(new Readline()); 

//global shared event emitter
global.universalEmitter = new EventEmitter();
    
let soldiers = new Array();

//open arduino connection and receive data
port.on('open', () => {
    console.log("Serial Connection is opened to RF");
});

//receving data from port
parser.on('data', (data) => {
        let soldier = new Soldier;
        let updateData; //what data was updated, i.e: gps, acc
        console.log(data);

        if(data.includes("<NEW_MSG>")){
            data.split(',').forEach((row)=>{
                if(row.includes("<MSG_ID>"))
                    soldier.msgID = parseInt(row.substring(9));
                if(row.includes("<SRC>")){
                    soldier.meshID = parseInt(row.substring(6));
                }
                if(row.includes("<DATA>")){
                    if(row.includes("G:")){
                        updateData = "gps";
                        soldier.gps = {
                            lan: parseFloat(row.split(':')[1]),
                            lat: parseFloat(row.split(':')[2])
                        }
                        // console.log(`Source: ${soldier.meshID} and message is: ${soldier.msgID} and gps is: ${soldier.data.gps.lan} `)
                        if(soldier.gps.lan != 0 && soldier.gps.lan != 0)
                            universalEmitter.emit('GPS', soldier);
                    }
                    if(row.includes("E:True")){
                        updateData = "emerg";
                        soldier.emerg = true
                        soldiers.forEach(_soldier => {
                            if (soldier.meshID == _soldier.meshID){
                                if(_soldier.emerg == false)
                                    //emit only if its false - emitting once
                                    universalEmitter.emit('Emergency', soldier);
                                _soldier.emerg = true;
                            }
                        });
                    }
                    if(row.includes("P:")){
                        updateData = "pulse"
                        soldier.pulse = (row.split(':')[1])
                        universalEmitter.emit('PULSE', soldier);
                    }
                    if(row.includes("A:")){
                        updateData = "acc"
                        soldier.acc = {
                            x: parseFloat(row.split(':')[1]),
                            y: parseFloat(row.split(':')[2]),
                            z: parseFloat(row.split(':')[3])   
                        }
                        universalEmitter.emit('ACC', soldier);
                    }

                    //add and update to dynamic current soldier list
                    let found = false;
                    let minute = 60 * 1000;
                    for(var i = 0; i < soldiers.length; i++) {
                        if (soldiers[i].meshID == soldier.meshID) { 
                            found = true;
                            switch(updateData){
                                case "gps":
                                    soldiers[i].gps = soldier.gps
                                    break;
                                case "emerg":
                                    soldiers[i].emerg = soldier.emerg
                                    break;
                                case "pulse":
                                    soldiers[i].pulse = soldier.pulse
                                    break;
                                case "acc":
                                    soldiers[i].acc = soldier.acc
                                    break;
                            }
                            //update message time
                            soldiers[i].lastMessage = new Date();
                        }
                        //if no messages recived for more than 10 seconds, emit to view
                        if(new Date() - soldiers[i].lastMessage > minute)
                            universalEmitter.emit('DISCONNECTED', soldier[i]);

                    }
                    if (!found)
                        soldiers.push(soldier);
                }
            });
        }
    });


    //error from port
    port.on('error', (err) =>{
        console.log("Serial Error: " + err);
    })


