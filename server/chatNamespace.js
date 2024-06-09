export function handleChatNamespace(io) {
    const chat = io.of('/chat');
    let userCountChat = 0; //track the number of connected users.
    const activeUsersChat = {}; // add an object to keep track of the users.

    chat.on('connection', (socket) => {
        let userNameChat;
        socket.emit('userCountChat', { count: Object.keys(activeUsersChat).length }); //send current user count immediately

        socket.on('registerUser', (userNameChat) => {
            if (activeUsersChat[userNameChat]) {
                socket.emit('registrationFailed', 'Name is already taken in this instance');
            } else {
                activeUsersChat[userNameChat] = socket.id; // Associate userName with socket ID
                socket.userNameChat = userNameChat;
                socket.emit('registrationSuccess', `Registered temporarily as ${userNameChat}`);
                userCountChat = Object.keys(activeUsersChat).length;
                chat.emit('userCountChat', { count: userCountChat });
            }
        });

        socket.on('sendMessage', (messageObject) => {
            const fullMessage = {
                ...messageObject,
                id: socket.id, // Add the sender's ID to the message object
                type: 'received' // Assume all messages are received unless it's from the current user
            };
            socket.broadcast.emit('message', fullMessage);
            socket.emit('message', { ...fullMessage, type: 'sent' });
        });

        socket.on('disconnect', () => {
            if (socket.userNameChat && activeUsersChat[socket.userNameChat]) {
                delete activeUsersChat[socket.userNameChat]; //remove the user from activeUsers
                userCountChat = Object.keys(activeUsersChat).length;
                chat.emit('userCountChat', { count: userCountChat });
            }
            console.log('User disconnected');
            console.log('number of users is ', userCountChat)
        });
    });
}

