$( function(){
  //WebSocket
  var socket = io.connect("http://"+location.hostname+":9001");

  socket.on('update', function (data) {
    $("#ika-hp").text(data.ika.hp);
    $("#challenger-num").text(Object.keys(data.clients).length);
    $("#hp-display").css('width',Math.floor( 10000 * data.ika.hp/data.ika.max_hp)/100 + "%" );
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

  // canvas要素のノードオブジェクト
  var canvas = $('#canvas')[0];
  // canvas要素の存在チェックとCanvas未対応ブラウザの対処
  if ( ! canvas || ! canvas.getContext ) {
    alert("canvas非対応ブラウザです");
  }
  var ctx = canvas.getContext('2d');

  //背景描画
  function drawBackground() {
    var img = new Image();
    img.src = './image/ika.png';
    img.onload = function() {
      ctx.drawImage( img, 0, 0, canvas.width, canvas.height);
    };
  };
  drawBackground();

});

