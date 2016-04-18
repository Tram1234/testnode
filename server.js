
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log('server running');

app.get('/',function(req,res){
     res.sendFile(__dirname + '/index.html')
});
// on connection
io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('sockets that connected ', connections.length);

     //on disconnect
    socket.on('disconnect',function (){
        connections.splice(connections.indexOf(socket),1);
        console.log('disconnected',connections.length);
        if(!socket.username)return;
        users.splice(users.indexOf(socket.username),1);
        updateUsers();
    });

    //on message
    socket.on('send message',function(data){
        console.log(data);
      io.sockets.emit('new message' , {msg:data});
    });
    //onLogin
    socket.on('user login',function(data,callback){
        console.log(data);
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsers();
    });
function updateUsers(){
    io.sockets.emit('get users', users);
}
});