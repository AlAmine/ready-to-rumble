(function($) {
  var socket = io.connect('http://localhost:8080');

  var player = false;
  var client_id = false;
  var turn = 0;
  var game_id = false;
  var game = {};

  $('#form_joueur_login').submit(function(event)  {
    event.preventDefault();
    socket.emit('login', {
      username: $('#joueur_login').val(),
      mail: $('#joueur_mail').val()
    })
  });

  socket.on('logged', function(user) {
    client_id = user.id;
    player = user;
    $('#login').hide();
    $('#room').show();
    var encart = '<img style="float:left;padding-right:20px;" src="' + user.avatar + '"id ="'+ user.id +'"><br /><b>'+' ' + user.login + '</b><br /><br />';
    $('#joueur_info').append(encart)
  });

// Gestion des utilsateurs connectés
  socket.on('newuser', function(user){

   var online = '<div id="' + user.id +'">';
   online += '<img style="float:left;padding-right:40px;" src="' + user.avatar + '"id ="'+ user.id +'"><br /><b>'+' ' + user.login + '</b>';
   online += '<input type="submit" class="defier" data-id="' + user.id + '" value="Défier" />';
   online += '</div><br />';

   $('#joueurs').append(online);

   $('.defier').click(function(){
     var src_id = client_id;
     var dest_id = $(this).attr('data-id');

     socket.emit('defi', {
       src_id: src_id,
       dest_id: dest_id,
      });
    });
 });

 // Gestion des défis
  socket.on('letsplay', function(adversaire) {
   var encart ='<div id="defi">';
   encart +=  'Vous avez été défié par :<br />';
   encart += '<img style="float:left;padding-right:10px;" src="' + adversaire.avatar + '"id ="'+ adversaire.id +'"><br /><b>' +' ' + adversaire.login +' ('+ adversaire.mail +')<br />';
   encart += '<input type="submit" class="defi_refuser" data-id="' + adversaire.id +'" value="Refuser" />';
   encart += '<input type="submit" class="defi_accepter" data-id="' + adversaire.id +'" value="Accepter" />';

   $('#defi').append(encart);
   $('.defi_accepter').click(function() {
     var src_id = client_id;
     var dest_id = $(this).attr('data-id');

     socket.emit('defi-accept', {
       src_id: src_id,
       dest_id: dest_id
     });
   })
 })

  socket.on('letsplay', function {
    if (game.player.id == client_id) {
      player = game.player1;
      adversaire = game.player2;
    } else {
      player = game.player2;
      adversaire = game.player1;
    }
    board = game.board;
    game_id = game.id;

    var msg = 'Vous êtes <strong>' + player.login + '</strong> et vous jouez contre <strong>' + adversaire.id + '</strong>';
    $('#game_details').append(msg);
    $('#room').hide();
    $('#game').show();

    if (player.num == 1) {
      game_id = player.id + adversaire.id;
    } else {
      game_id = adversaire.id + player.id;
    }
    turn = 1;
    set_turn(turn);
  })
  socket.on('leave', function(perso){
   $('#' + perso.id).remove();
 })
})(jQuery)
