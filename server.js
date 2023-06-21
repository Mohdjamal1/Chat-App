const express = require('express'); //Import Express
const app = express();  // Sets up our express -> express allows us to create a server
const server = require('http').Server(app);//making a server using http and express
const io = require('socket.io')(server);// importing socket.io and linking it with server
// this is port on which our server will run
const PORT = 9000;
server.listen(PORT,()=>{
    console.log(`server is run on port ${PORT}`);
})
const users ={};
app.use(express.static('public'));//giving public folder to my express app

io.on('connection', (socket)=>{
    console.log('connection established', socket.id);
    // triggering on 'message' event
    socket.on('new user join',(username)=>{
        console.log("new user", username);
        users[socket.id]=username;
        io.emit('new user join',username);
    })
    socket.on('message',(data)=>{ // user is sending message
        // giving that message to io
        //socket.broadcast.emit('message',data);  use this either down line.
        io.emit('message',data); // emitting this message to
        // all other sockets
    })
    socket.on('disconnect', message=>{
        io.emit('close',users[socket.id]);
        delete users[socket.id];
        console.log( `left the chat`);
    })
})
