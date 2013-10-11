var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

app.listen(9001);

function handler (req, res) {
  fs.readFile(__dirname + '../www/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

var ika = {
  hp:10000,
  max_hp:10000,
  high_score:999,
};
var clients = new Object();
var current_id = 0;

var is_scoring = false;
var timer = 0;

io.sockets.on('connection', function (socket) {
  var c = {id:current_id,count:100};
  clients[current_id] = c;
  current_id++;

  socket.emit('score',{score:ika.high_score});

  socket.on('init', function (data){
    ika = data.ika;
  });
  
  socket.on('attacking',function (data){
    if(is_scoring){
      ika.hp = Math.max( 0, ika.hp - data.damage );
      io.sockets.emit('attacking',data);
      update();
      if(ika.hp == 0) finish();
    }
  });

  socket.on('alive',function (){
    c.count = 100;
  });

  socket.on('start',function (){
    start();
  });

  socket.on('finish',function (){
    finish();
  });

});

function update(){
  io.sockets.emit('update',{ika:ika,clients:clients});
};

function start(){
  ika.hp = ika.max_hp;
  timer = 0;
  is_scoring = true;
};

function finish(){
  io.sockets.emit('finish', {score:(timer/100), clients:clients} );
  is_scoring = false;
};

setInterval(function(){
  if(is_scoring) timer++;
},10);

setInterval(function(){
  if(is_scoring){
    update();
    if(ika.hp < ika.max_hp){
      ika.hp++;
    };
    for(var i in clients){
      clients[i].count--;
      if(clients[i].count < 0){
        delete clients[i];
      };
    }
  }
},80);
