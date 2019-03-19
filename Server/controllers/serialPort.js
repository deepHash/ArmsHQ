const SerialPort = require('serialport'),
      EventEmitter = require('events'),
      portName = process.argv[2],
      Readline = require('@serialport/parser-readline'),
      client = require('../database'),
      port = new SerialPort(portName, { baudRate: 115200 }),
      parser = port.pipe(new Readline({ delimiter: '\r\n'})); 

//global shared event emitter
global.universalEmitter = new EventEmitter();

    var from ="6",
        time ="210100";

    //open arduino connection and receive data
    port.on('open', () => {
        console.log("Serial Connection is opened to RF");
    });

    //receving data from port
    parser.on('data', (data) => {
        time++;
        //client.lpush("Sold::"+from+"::ACC","Time:"+time+"|"+data);
        universalEmitter.emit('RFMessage', data);
    })

    //error from port
    port.on('error', (err) =>{
        console.log("ERROR:" + err);
    })


