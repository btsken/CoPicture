var WebSocketServer = require('ws').Server,
    ws = new WebSocketServer({
        port: 8085
    });

var templete = null,
    background = null;

var ONLINE_NUM = "onlineNum",
    // TEMPLETE = "templete",
    // BACKGROUNF = "background",
    CIRCLE_ARY = "circle",
    NEW_PICTURE = "newPicture",
    PICTURE = "picture";

var circlelastMessage = "",
    newPicturelastMessage = "",
    picturelastMessage = "";

ws.broadcast = function(data) {
    for (var i in this.clients) {
        this.clients[i].send(data);
    }
};

ws.on('connection', function(_ws) {
    _ws.on('message', function(message) {

        var object = JSON.parse(message);

        switch (object.name) {
            case CIRCLE_ARY:
                circlelastMessage = message;
                break;
            case PICTURE:
                picturelastMessage = message;
                break;
            case NEW_PICTURE:
                newPicturelastMessage = message;
                break;
        }

        ws.broadcast(message);
    });

    var that = this;
    _ws.on('close', function() {
        sendCommand(ONLINE_NUM, new Client(that.clients.length));
    });

    sendCommand(ONLINE_NUM, new Client(this.clients.length));

    // console.log(circlelastMessage);
    // console.log(picturelastMessage);
    // console.log(newPicturelastMessage);

    ws.broadcast(circlelastMessage);
    ws.broadcast(picturelastMessage);
    ws.broadcast(newPicturelastMessage);
});

function sendCommand(commandName, object) {
    new Command(commandName, object).send();
}

function Client(clientNum) {
    this.clientNum = clientNum;
}

function Command(name, object) {
    this.name = name;
    this.object = object;
}

Command.prototype.send = function() {
    ws.broadcast(JSON.stringify(this));
};
