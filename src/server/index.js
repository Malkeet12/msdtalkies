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

// app.get('/', function (req, res) {
//   //res.redirect('./index');
//   app.use(express.static(__dirname + '/../../build'))
// });
// app.get('/MSD', (req, res) => {
//   res.send('Hi MSD');
// });




let url = 'mongodb://msd:12malkeet@ds237192.mlab.com:37192/msdtalkies1'


const MongoClient = require('mongodb').MongoClient






// const server = require('http').Server(app)
// const io = module.exports.io = require('socket.io')(server)


// const SocketManager = require('./SocketManager')
// //app.use(express.static(__dirname + '/../../build'))
// io.on('connection', SocketManager)

// server.listen(PORT, ()=>{
// 	console.log("Connected to port:" + PORT);
// })


var app = require('http').createServer()
var io = module.exports.io = require('socket.io')(app)

const PORT = process.env.PORT || 3231

const SocketManager = require('./SocketManager')

io.on('connection', SocketManager)
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  var dbo = db.db("msdtalkies1");
 var myobj = { name: "MSD", address: "Highway 24" };
  // dbo.collection("customers").insertOne(myobj, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 document inserted");
  //   db.close();
  // });
  // var query = { name: "Park Lane 38" };
  // dbo.collection("customers").find({}).toArray(function(err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   db.close();
  // });
  // var myquery = { name: "Company Inc" };
  // var newvalues = { $set: {pwd: "company" } };
  // dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 document updated");
  //   db.close();
  // });
})
app.listen(PORT, ()=>{
  console.log("Connected to port:" + PORT);
  
})


