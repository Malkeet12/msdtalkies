const io = require('./index.js').io
const uuidv4 = require('uuid/v4')

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED,
	LOGOUT, COMMUNITY_CHAT, FRIENDS_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT,
	TYPING, PRIVATE_MESSAGE, REQUEST_SENT, VERIFY_FRIEND, LOGIN_USER, NEW_CHAT_USER, CHANGE_IMAGE } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')
let url = 'mongodb://msd:12malkeet@ds237192.mlab.com:37192/msdtalkies1'


const MongoClient = require('mongodb').MongoClient
let connectedUsers = {}
let allUsers = []
let communityChat = createChat({ name: 'Community', isCommunity: true })
communityChat.online = true
console.log({ communityChat })
module.exports = function (socket) {

	// console.log('\x1bc'); //clears console
	console.log("Socket Id:" + socket.id);

	let sendMessageToChatFromUser;

	let sendTypingFromUser;
	let friendsChat = []


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



	socket.on(LOGIN_USER, (nickname, password, callback) => {
		setTimeout(() => callback({ isUser: true, user: null, message: { text: 'Please check your connection and try again', error: true } }), 15000)
		MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {

			if (err) {
				callback({ isUser: true, user: null, message: { text: 'Please check your connection and try again', error: true } })
				throw err
			}
			var dbo = db.db("msdtalkies1");
			dbo.collection("customers").find().toArray(function (err, result) {
				allUsers = result
				//console.log({allUsers})
			})

			allUsers.map(user => {
				socket.emit(USER_CONNECTED, user);
			})
			dbo.collection("customers").find({ 'name': nickname }).toArray(function (err, result) {
				if (err) throw err;

				let arr = result[0].friendsList

				if (result[0].name !== nickname) {
					callback({ isUser: true, user: null, message: { text: 'Invalid username', error: true } })
				} else {
					{
						friendsChat = []
						if (Array.isArray(arr))
							arr.map(item => {
								friendsChat.push(createChat({
									isCommunity: false, id: item.chatId, name: item.name, messages: item.messages, friendRequest: item.friendRequest, email: item.email,online:item.online
								}))
							})
					}
					if (password == result[0].password) {
						callback({ isUser: false, user: createUser({ name: nickname, imgUrl: '', socketId: socket.id, chatId: result[0].id, online: true }), error: '' })
					} else {
						callback({ isUser: true, user: null, message: { text: 'Invalid username / password pair', error: true } })
					}
				}
				db.close();
			});

		})
	})

	socket.on(VERIFY_FRIEND, (userName, userId, email, callback) => {
		MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {

			if (err) throw err;
			var dbo = db.db("msdtalkies1");
			dbo.collection("customers").find({ 'email': email }).toArray(function (err, result) {
				if (err) throw err;
				let index = result.findIndex(item => item.email == email)
				console.log({ userName })
				if (result[index] != null) {
					dbo.collection("customers").updateOne(
						{ name: userName },
						{ $push: { friendsList: { $each: [{ id: result[index].id, name: result[index].name, chatId: '', friendRequest: 'sender', email: result[index].email }] } } }
					)
					dbo.collection("customers").updateOne(
						{ email: email },
						{ $push: { friendsList: { $each: [{ id: userId, name: userName, chatId: '', friendRequest: 'receiver', email: email }] } } }
					)
				}
				callback(result[index])
			})
		})
	})


	socket.on(REQUEST_SENT, (flag, user, chat, callback) => {
		if (flag == true) {
			MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db("msdtalkies1");
				let success = 0
				let chatId = uuidv4()
				dbo.collection("customers").find({ 'name': chat.name }).toArray(function (err, result) {
					console.log('yess', result[0])
					if (result[0] != null) {
						// request accepted by user
						dbo.collection("customers").updateOne(
							{ name: chat.name, "friendsList.name": user },
							{ $set: { "friendsList.$.friendRequest": true, "friendsList.$.chatId": chatId } },
							function (err, result) {
								if (err) throw err;
								console.log(result);
								success = success + 1;
							})

						//accepting request 
						dbo.collection("customers").updateOne(
							{ name: user, "friendsList.name": chat.name },
							{ $set: { "friendsList.$.friendRequest": true, "friendsList.$.chatId": chatId } },
							function (err, result) {
								if (err) throw err;
								console.log(result);
								callback(true)
							})

					}



				})
			})
		}

	})
	//Verify Username
	socket.on(VERIFY_USER, (nickname, email, password, callback) => {
		MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {

			if (err) throw err;
			var dbo = db.db("msdtalkies1");
			var myobj = { name: nickname, email: email, password: password, id: uuidv4(), friendsList: [] };
			dbo.collection("customers").find({ 'name': nickname }).toArray(function (err, result) {
				if (err) throw err;
				let index = result.findIndex(item => item.name == nickname)
				if (index !== -1) {
					callback({ isUser: true, user: null, message: { text: `User name is already taken, try again or choose from : ${nickname}${uuidv4().slice(0, 2)}, ${nickname}${uuidv4().slice(0, 2)}, ${nickname}${uuidv4().slice(0, 2)}`, error: true } })
				} else {
					dbo.collection("customers").insertOne(myobj, function (err, res) {
						if (err) throw err;
						console.log("1 document inserted");
						callback({ isUser: true, user: null, message: { text: 'Your account has been created successfully. Please log in.', success: true } })
						db.close();
					});
				}
			})
		})
	})
	//callback({ isUser:true, user:null, error:`User name is already taken, try again or choose from : ${nickname}${uuidv4().slice(0,2)}, ${nickname}${uuidv4().slice(0,2)}, ${nickname}${uuidv4().slice(0,2)}` })
	socket.on(CHANGE_IMAGE, (userName, imgUrl, callback) => {
		console.log('changed')
	})

	//User Connects with username
	socket.on(USER_CONNECTED, (user, socketId) => {
		if (user && socket) {
			//user.socketId = socket.id
			// if (socketId) {
			// 	user.socketId = socketId
			// 	socket.id=socketId
			// }
			//	console.log('socket', user)
			connectedUsers = addUser(connectedUsers, user)
			socket.user = user
			console.log(user)
			sendMessageToChatFromUser = sendMessageToChat(user.name, user.id)
			sendTypingFromUser = sendTypingToChat(user.name)

			io.emit(USER_CONNECTED, connectedUsers, allUsers, socket.id, user)
		}

	})

	//User disconnects
	socket.on('disconnect', () => {
		if ("user" in socket) {
			connectedUsers = removeUser(connectedUsers, socket.user.name)
			console.log('disc', socket.user)
			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
	})


	//User logsout
	socket.on(LOGOUT, () => {
		if (socket && socket.user) {
			connectedUsers = removeUser(connectedUsers, socket.user.name)
			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Disconnect", connectedUsers);
		}


	})

	//Get Community Chat
	socket.on(COMMUNITY_CHAT, (callback) => {
		callback(communityChat)
	})
	socket.on(FRIENDS_CHAT, (callback) => {
		callback(friendsChat);
	})
	socket.on(MESSAGE_SENT, ({ id, message, user }) => {
		console.log({ message }, { id })
		if (typeof sendMessageToChatFromUser == 'function') {

			sendMessageToChatFromUser(id, message)
		}

	})

	socket.on(TYPING, ({ chatId, isTyping }) => {
		if (typeof (sendTypingFromUser) == 'function')
			sendTypingFromUser(chatId, isTyping)
	})

	socket.on(PRIVATE_MESSAGE, ({ reciever, sender, activeChat }) => {
		console.log(reciever, activeChat, user, connectedUsers)
		if (reciever in connectedUsers) {
			const recieverSocket = 'connectedUsers[reciever].socketId'
			if (activeChat === null || activeChat.id === communityChat.id) {
				const newChat = createChat({ name: `${reciever}&${sender.name}`, users: [reciever, sender.name], chatId: '' })
				socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
				socket.emit(PRIVATE_MESSAGE, newChat)
			} else {
				// if (!(reciever in activeChat.users)) {
				// 	activeChat.users
				// 		.filter(user => user in connectedUsers)
				// 		.map(user => connectedUsers[user])
				// 		.map(user => {
				// 			socket.to(user.socketId).emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: reciever })
				// 		})
				// 	socket.emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: reciever })
				// }
				// socket.to(recieverSocket).emit(PRIVATE_MESSAGE, activeChat)
			}
		} else {
			console.log(reciever, activeChat, user)
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
function sendMessageToChat(sender, id) {
	console.log(sender, id)
	return (chatId, message) => {
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({ message, sender, id }))
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
