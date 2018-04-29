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


  socket.on('leave', function(perso){
   $('#' + user.id).remove();
 })
})(jQuery)
