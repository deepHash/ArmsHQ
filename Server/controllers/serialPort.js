const SerialPort    = require('serialport'),
      portName      = process.argv[2],
      Readline      = require('@serialport/parser-readline'),
      port          = new SerialPort(portName, { baudRate: 115200 }),
      parser        = port.pipe(new Readline()),
      DataParser    = require('./DataParser'),
      handleData    = DataParser();
    
//open arduino connection and receive data
port.on('open', () => {
    console.log("Serial Connection is opened to RF");
});

//receving data from port
parser.on('data', (data) => {
    console.log(data);
    handleData.pipe(data);
});

//error from port
port.on('error', (err) =>{
    console.log("Serial Error: " + err);
})


