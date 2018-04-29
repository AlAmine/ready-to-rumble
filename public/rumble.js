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
  socket.on('newuser', function(perso){
    client_id = perso.id;
    player = perso;
   var online = '<div id="' + perso.id +'">';
   online += '<img style="float:left;padding-right:40px;" src="' + perso.avatar + '"id ="'+ perso.id +'"><br /><b>'+' ' + perso.login + '</b>';
   online += '<input type="submit" class="defier" data-id="' + perso.id + '" value="Défier" />';
   online += '</div><br />';

   $('#joueurs').append(online);
   $('.defier').click(function(){
     var src_id = client_id;
     var dest_id = $(this).attr('data-id');

     socket.emit('defi', {
       src_id: src_id,
       dest_id: dest_id,
       perso: [perso]

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

     socket.emit('defi-accept', );
   })
 })
  socket.on('leave', function(perso){
   $('#' + perso.id).remove();
 })
})(jQuery)
