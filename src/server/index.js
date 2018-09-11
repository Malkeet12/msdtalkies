
var express = require('express');
var app = express();
const PORT = process.env.PORT || 3231
const server = require('http').Server(app)
const io = module.exports.io = require('socket.io')(server)


const SocketManager = require('./SocketManager')
app.use(express.static(__dirname + '/../../build'))
io.on('connection', SocketManager)

server.listen(PORT, ()=>{
	console.log("Connected to port:" + PORT);
})

app.get('/', function (req, res) {
  //res.redirect('./index');
  
  res.send('HOme');
});
app.get('/MSD', (req, res) => {
  res.send('Hi MSD');
});
// var server = app.listen(8081, function () {
//    var host = server.address().address
//    var port = server.address().port
//    console.log(host)
//    console.log(port)
//    console.log("Example app listening at http://%s:%s", host, port)
// })




//const express = require('express');

// var ObjectID = require('mongodb').ObjectID;
// const bodyParser = require('body-parser')
// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// const PORT = process.env.PORT || 3000

// app.listen(PORT, function () {
//   console.log('listening on PORT');
// });












// var app = require('http').createServer()
// var io = module.exports.io = require('socket.io')(app)

// const PORT = process.env.PORT || 3231

// const SocketManager = require('./SocketManager')

// io.on('connection', SocketManager)

// app.listen(PORT, ()=>{
//   console.log("Connected to port:" + PORT);
  
// })


