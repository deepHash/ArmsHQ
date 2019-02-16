const SerialPort = require('serialport'),
      EventEmitter = require('events'),
      portName = process.argv[2],
      Readline = require('@serialport/parser-readline'),
      port = new SerialPort(portName, { baudRate: 115200 }),
      parser = port.pipe(new Readline({ delimiter: '\r\n'})); 

//global shared event emitter
global.universalEmitter = new EventEmitter();

    //open arduino connection and receive data
    port.on('open', () => {
        console.log("Connection is opened");
    });

    //receving data from port
    parser.on('data', (data) => {
        universalEmitter.emit('RFMessage', data);
    })

    //error from port
    port.on('error', (err) =>{
        console.log("ERROR:" + err);
    })


