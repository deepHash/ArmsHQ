var SerialPort = require('serialport');
var portName = process.argv[2];

var serialPort = new SerialPort(portName, {
    baudRate: 115200,
    parser: new SerialPort.parsers.Readline('\r\n')
});
//@ToDo add serialPort.pipe()

//open arduino connection and receive data
serialPort.on("open", () => {
    console.log("Connection is opened");
})

//receving data from port
serialPort.on('data', (data) => {
    console.log(''+data);
})

//error from port
serialPort.on('error', (err) =>{
    console.log("ERROR:" + err);
})