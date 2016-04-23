
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var morgan = require('morgan');
var config = require('./config/database.js');

users = [];
connections = [];

//databes connection
mongoose.connect(config.database);

require('./config/passport')(passport); // pass passport for configuration

//gettting requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//logs on terminal
app.use(morgan('dev'));
app.use(cookieParser());//for cookies
app.use(bodyParser());  //info from html
app.set('view engine', 'ejs');  //for randering templates

app.use(session({ secret: 'lacucarachalacucaracha' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routs.js')(app, passport);



server.listen(process.env.PORT || 3000);

console.log('server running');




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