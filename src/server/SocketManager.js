const io = require('./index.js').io
const uuidv4 = require('uuid/v4')

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED,
	LOGOUT, COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT,
	TYPING, PRIVATE_MESSAGE, NEW_CHAT_USER, CHANGE_IMAGE } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')
let url = 'mongodb://msd:12malkeet@ds237192.mlab.com:37192/msdtalkies1'


const MongoClient = require('mongodb').MongoClient
let connectedUsers = {}

let communityChat = createChat({ isCommunity: true })

module.exports = function (socket) {

	// console.log('\x1bc'); //clears console
	console.log("Socket Id:" + socket.id);

	let sendMessageToChatFromUser;

	let sendTypingFromUser;



	// socket.on(VERIFY_USER, (nickName, number, callback) => {
	// 	const accountSid = 'AC9a04c0902b0032beed825c620785f7e5';
	// 	const authToken = '5ac98e6db50bb0c902f23dc044c276d4';
	// 	const client = require('twilio')(accountSid, authToken);
	// 	let otp = uuidv4();
	// 	console.log({ otp })
	// 	client.messages
	// 		.create({
	// 			body: otp.slice(0, 4),
	// 			from: '+19376967696',
	// 			to: number
	// 		})
	// 		.then(message => console.log(message.sid))
	// 		.done();
	// 	callback({ otp: otp, user: createUser({ name: nickName, number: number, socketId: socket.id, otp: otp.slice(0, 4) }) })

	// if(isUser(connectedUsers, number)){
	// 	callback({ isUser:true, user:null })
	// }else{
	// 	callback({ isUser:false, user:createUser({name:number, socketId:socket.id})})
	// }
	//})

	//Verify Username
	socket.on(VERIFY_USER, (nickname, pwd, callback) => {
		MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {

			if (err) throw err;
			var dbo = db.db("msdtalkies1");
			var myobj = { name: "Company Inc", address: "Highway 37" };
			var query = { name: nickname };
			// dbo.collection("customers").findOne({name:"MSD"  }).then(function(res){
			// 	console.log(res)
			// })
			dbo.collection("customers").find({ 'name': "MSD" }).toArray(function (err, result) {
				if (err) throw err;
				console.log(result);
				let index = result.findIndex(item => item.name == nickname)
				if (index == -1) {
					callback({ isUser: true, user: null, error: 'Invalid username' })
				} else {
					if (pwd == result[index].pwd) {
						callback({ isUser: false, user: createUser({ name: nickname, imgUrl: '', socketId: socket.id }) })
					} else {
						callback({ isUser: true, user: null, error: 'Invalid username / password pair' })
					}
				}
					db.close();
				});

		})
	})
	//callback({ isUser:true, user:null, error:`User name is already taken, try again or choose from : ${nickname}${uuidv4().slice(0,2)}, ${nickname}${uuidv4().slice(0,2)}, ${nickname}${uuidv4().slice(0,2)}` })
	socket.on(CHANGE_IMAGE, (userName, imgUrl, callback) => {
		console.log('changed')
	})

	//User Connects with username
	socket.on(USER_CONNECTED, (user) => {
		user.socketId = socket.id
		connectedUsers = addUser(connectedUsers, user)
		socket.user = user

		sendMessageToChatFromUser = sendMessageToChat(user.name)
		sendTypingFromUser = sendTypingToChat(user.name)

		io.emit(USER_CONNECTED, connectedUsers)
		console.log(connectedUsers);

	})

	//User disconnects
	socket.on('disconnect', () => {
		if ("user" in socket) {
			connectedUsers = removeUser(connectedUsers, socket.user.name)

			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
	})


	//User logsout
	socket.on(LOGOUT, () => {
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		io.emit(USER_DISCONNECTED, connectedUsers)
		console.log("Disconnect", connectedUsers);

	})

	//Get Community Chat
	socket.on(COMMUNITY_CHAT, (callback) => {
		callback(communityChat)
	})

	socket.on(MESSAGE_SENT, ({ chatId, message }) => {
		if (typeof sendMessageToChatFromUser == 'function')
			sendMessageToChatFromUser(chatId, message)
	})

	socket.on(TYPING, ({ chatId, isTyping }) => {
		if (typeof (sendTypingFromUser) == 'function')
			sendTypingFromUser(chatId, isTyping)
	})

	socket.on(PRIVATE_MESSAGE, ({ reciever, sender, activeChat }) => {
		console.log({ reciever }, { sender }, { activeChat }, { connectedUsers })
		if (reciever in connectedUsers) {
			const recieverSocket = connectedUsers[reciever].socketId
			if (activeChat === null || activeChat.id === communityChat.id) {
				const newChat = createChat({ name: `${reciever}&${sender}`, users: [reciever, sender] })
				socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
				socket.emit(PRIVATE_MESSAGE, newChat)
			} else {
				if (!(reciever in activeChat.users)) {
					activeChat.users
						.filter(user => user in connectedUsers)
						.map(user => connectedUsers[user])
						.map(user => {
							socket.to(user.socketId).emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: reciever })
						})
					socket.emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: reciever })
				}
				socket.to(recieverSocket).emit(PRIVATE_MESSAGE, activeChat)
			}
		}
	})

}
/*
* Returns a function that will take a chat id and a boolean isTyping
* and then emit a broadcast to the chat id that the sender is typing
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendTypingToChat(user) {
	return (chatId, isTyping) => {
		io.emit(`${TYPING}-${chatId}`, { user, isTyping })
	}
}

/*
* Returns a function that will take a chat id and message
* and then emit a broadcast to the chat id.
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendMessageToChat(sender) {
	return (chatId, message) => {
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({ message, sender }))
	}
}

/*
* Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
*/
function addUser(userList, user) {
	let newList = Object.assign({}, userList)
	newList[user.name] = user
	return newList
}

/*
* Removes user from the list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {string} name of user to be removed
* @return userList {Object} Object with key value pairs of Users
*/
function removeUser(userList, username) {
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}

/*
* Checks if the user is in list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {String}
* @return userList {Object} Object with key value pairs of Users
*/
function isUser(userList, username) {
	return username in userList
}
