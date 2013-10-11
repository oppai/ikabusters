var g_attacking = 0;

$( function(){
  //WebSocket
  var socket = io.connect("http://"+location.hostname+":9001");

  socket.on('update', function (data) {
    $("#ika-hp").text(data.ika.hp);
    $("#challenger-num").text(Object.keys(data.clients).length);
    $("#hp-display").css('width',Math.floor( 10000 * data.ika.hp/data.ika.max_hp)/100 + "%" );
    g_attacking = Math.max(g_attacking - 1,0);
  });

  socket.on('attacking', function (data) {
    g_attacking = 5;
  });

  $(window).bind("devicemotion", function(e){
    var a = e.originalEvent.acceleration;
    var v = Math.sqrt( (a.x*a.x + a.y*a.y + a.z*a.z)/3 );
    $("#accel").text( v );
    if(v > 3.0) {
      socket.emit('attacking',{damage:~~v,name:"device"});
    }
  });

  $('#attacking').click(function(){
    socket.emit('attacking',{damage:10,name:"device"});
  });

  setInterval(function(){
    socket.emit('alive');
  },100);

});

