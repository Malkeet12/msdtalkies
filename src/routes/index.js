// const express =require('express')

// const MongoClient = require('mongodb').MongoClient
// var ObjectID = require('mongodb').ObjectID;
// const bodyParser= require('body-parser')
// const app = express();

// app.listen(3000, function() {
//   console.log('listening on 3000');
// });

// app.get('/', function(req, res) {
//   res.send("Yep it's working");
// });
// app.get('/MSD', (req, res) => {
//   res.send('Hi MSD');
// });

// //mongodb://<dbuser>:<dbpassword>@ds237192.mlab.com:37192/msdtalkies1



// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// MongoClient.connect('mongodb://msd:12malkeet@ds237192.mlab.com:37192/msdtalkies1',{ useNewUrlParser: true }, (err, db) => {
//   var dbase = db.db("msdtalkies");
//   if (err) return console.log(err)
//   app.listen(3000, () => {
//     console.log('app working on 3000')
//        res.send('name added successfully');
//     });
//   })





// const server = require('http').Server(app)
// const io = module.exports.io = require('socket.io')(server)

// const PORT = process.env.PORT || 3231

// const SocketManager = require('../server/SocketManager')
// app.use(express.static(__dirname + '/../../build'))
// io.on('connection', SocketManager)

// server.listen(PORT, ()=>{
// 	console.log("Connected to port:" + PORT);
// })




