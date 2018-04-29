const express = require('express')
const app = express()
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const md5 = require('MD5')
const url = 'mongodb://nodeApp:567890@127.0.0.1:27017/memory';
let DB;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index.html');
});

var server = app.listen(process.env.PORT || 8080, () => console.log('We are in the Building'));



var io = require('socket.io').listen(server);

  var sockets = {};
  var players = {};

io.on('connection', function(socket) {
  var user = false;

  for (var i in players){
      socket.emit('newuser', players[i])
    }

    // Connexion au serveur
  socket.on('login', function(joueur_info){

    console.log(joueur_info.username)

    var user = {};
    console.log(players)
    console.log(socket.id)
    user.login = joueur_info.username;
    user.email = joueur_info.mail;
    user.id = joueur_info.mail.replace('@', '-').replace('.', '-');
    user.avatar = 'https://gravatar.com/avatar/' + md5(joueur_info.mail) + '?s=50';
    user.online = true;

    players[user.id] = user;
    sockets[user.id] = socket;

    socket.emit('logged', user);
    socket.broadcast.emit('newuser', user);
  })



  // Deconnexion du serveur
  socket.on('disconnect', function() {
    if(!user) {
      return false
    }
    delete sockets[user.id]

    console.log(players[user.id]);
    io.sockets.emit('leave', perso)
  })
})
