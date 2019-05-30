const SerialPort = require('serialport'),
      EventEmitter = require('events'),
      portName = process.argv[2],
      Readline = require('@serialport/parser-readline'),
      port = new SerialPort(portName, { baudRate: 115200 }),
      parser = port.pipe(new Readline()); 

//global shared event emitter
global.universalEmitter = new EventEmitter();

    let soldier = {
        msgID: Number,
        meshID: 6,
        name: String,
        data: { 
            gps: {
                lan: Number,
                Lat: Number
        }}
    }

    //open arduino connection and receive data
    port.on('open', () => {
        console.log("Serial Connection is opened to RF");
    });

    //receving data from port
    parser.on('data', (data) => {
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
                        console.log(row);
                        soldier.data = {
                            gps:{
                                lan: parseFloat(row.split(':')[1]),
                                lat: parseFloat(row.split(':')[2])
                            }
                        }
                        // console.log(`Source: ${soldier.meshID} and message is: ${soldier.msgID} and gps is: ${soldier.data.gps.lan} `)
                        if(soldier.data.gps.lan != 0 && soldier.data.gps.lan != 0)
                            universalEmitter.emit('GPS', soldier);
                    }
                    if(row.includes("E:True")){
                        soldier.data = {
                            emerg: true
                        }
                        universalEmitter.emit('Emergency', soldier);
                    }
                    if(row.includes("P:")){
                        soldier.data = {
                            pulse: (row.split(':')[1])
                        }
                        universalEmitter.emit('Pulse', soldier);
                    }
                    if(row.includes("A:")){
                        console.log(`ACC IS : ${row.split(':')[2]}`);

                        soldier.data = {
                            acc:{
                                x: parseFloat(row.split(':')[1].split(',')[0]),
                                y: parseFloat(row.split(':')[1].split(',')[1]),
                                z: parseFloat(row.split(':')[1].split(',')[2])
                            }
                        }
                    }
                    //ToDo add all switch cases
                }
        
            });
        }
        //universalEmitter.emit('RFMessage', soldier);
    })

    //error from port
    port.on('error', (err) =>{
        console.log("Serial Error: " + err);
    })


