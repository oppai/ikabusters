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
io.sockets.on('connection', function (socket) {
  socket.on('init',function (data){
    ika = data.ika;
  });
  socket.on('attacking',function (data){
    ika.hp -= data.damage;
    socket.emit('attacking',data);
    update();
  });
  function update(){
    socket.emit('update',{ika:ika});
  }
  setInterval(function(){
    update();
  },80);
});

