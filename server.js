const express = require('express')
const app = express()
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const md5 = require('MD5')
const url = 'mongodb://nodeApp:567890@127.0.0.1:27017/memory';
let DB;

app.use(express.static('public'))

var server = app.listen(process.env.PORT || 8080, () => console.log('We are in the Building'))

MongoClient.connect(url, function(err, client) {

  if (err) {
    throw err;
  }
DB = client.db('memory');
 })


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
    console.log(user)
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

  socket.on('defi', function(defi) {
  var adversaire = {};

  adversaire.id = defi.dest_id;
  adversaire.login = defi.perso.login;
  adversaire.avatar = defi.perso.avatar;
  adversaire.mail = defi.perso.mail;
  io.to(defi.dest_id).emit('letsplay', adversaire);

  })



  // Deconnexion du serveur
  socket.on('disconnect', function() {
    if(!user) {
      return false
    }
    delete players[perso.id]

    console.log(players[perso.id]);
    io.sockets.emit('leave', perso)
  })
})
