var WebSocketServer = require('ws').Server,
    ws = new WebSocketServer({
        port: 8085
    });

var templete = null,
    background = null;

var ONLINE_NUM = "onlineNum",
    TEMPLETE = "templete",
    BACKGROUNF = "background",
    CIRCLE_ARY = "circle";

var lastMessage = "";    

ws.broadcast = function(data) {
    for (var i in this.clients) {
        this.clients[i].send(data);
    }
};

ws.on('connection', function(_ws) {
    _ws.on('message', function(message) {
        lastMessage = message;
        ws.broadcast(message);
    });

    var that = this;
    _ws.on('close', function() {
        sendCommand(ONLINE_NUM, new Server(that.clients.length));
    });

    sendCommand(ONLINE_NUM, new Server(this.clients.length));
    ws.broadcast(lastMessage);
});

function sendCommand(commandName, object) {
    new Command(commandName, object).send();
}

function Server(clientNum) {
    this.clientNum = clientNum;
}

// Server.prototype.send = function() {
//     ws.broadcast(JSON.stringify(this));
// };

function Command(name, object) {
    this.name = name;
    this.object = object;
}

Command.prototype.send = function() {
    ws.broadcast(JSON.stringify(this));
};
