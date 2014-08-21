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
    BACKGROUND = "background",
    TEXT = "text",
    PICTURE = "picture";

var backgroundlastMessage = "",
    newPicturelastMessage = "",
    textlastMessage = "",
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
            case BACKGROUND:
                backgroundlastMessage = message;
                break;
            case PICTURE:
                picturelastMessage = message;
                break;
            case NEW_PICTURE:
                newPicturelastMessage = message;
                break;
            case TEXT:
                textlastMessage = message;
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

    ws.broadcast(backgroundlastMessage);
    ws.broadcast(picturelastMessage);
    ws.broadcast(newPicturelastMessage);
    ws.broadcast(textlastMessage);
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
