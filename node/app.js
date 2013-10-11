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
  hp:1000,
  max_hp:1000,
};
var clients = new Object();
var current_id = 0;

io.sockets.on('connection', function (socket) {
  var c = {id:current_id,count:100};
  clients[current_id] = c;
  current_id++;

  socket.on('init',function (data){
    ika = data.ika;
  });
  
  socket.on('attacking',function (data){
    ika.hp = Math.max( 0, ika.hp - data.damage );
    io.sockets.emit('attacking',data);
    update();
  });

  socket.on('alive',function (){
    c.count = 100;
  });
});

function update(){
  io.sockets.emit('update',{ika:ika,clients:clients});
};

setInterval(function(){
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
},80);
