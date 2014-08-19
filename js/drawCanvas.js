    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvas2 = document.getElementById('drawLayer');
    var ctx2 = canvas2.getContext('2d');
    var rr = document.getElementById('right');
    var ctx3 = rr.getContext('2d');
    var dd = document.getElementById('down');
    var ctx4 = dd.getContext('2d');
    //var imageLoader = document.getElementById('input');
    //imageLoader.addEventListener('change', handleImage, false);
    canvas.width = 480;
    canvas.height = 640;
    canvas2.width = 480;
    canvas2.height = 640;
    rr.width = 480;
    rr.height = 640;
    dd.width = 900;
    dd.height = 100;
    var bg = 0;
    var lay = 0;
    var rrset = 0;
    var p;
    var hex;
    var drawMode;
    var sizex = 95;
    var lineWidth = 2;
    var currentMouseX, currentMouseY;

    function Point(initialX, initialY, afterX, afterY, width, color) {
        this.width = width;
        this.initialX = initialX;
        this.initialY = initialY;
        this.afterX = afterX;
        this.afterY = afterY;
        this.color = color;
        this.draw = function(ctx) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.moveTo(initialX, initialY);
            ctx.lineTo(afterX, afterY);
            ctx.stroke();
        };

    }

    color = ["#FFFFFF", "#E0E0E0", "#BEBEBE", "#ADADAD", "#9D9D9D",
        "#8E8E8E", "#6C6C6C", "#3C3C3C", "#272727", "#000000",
        "#FFD2D2", "#FFB5B5", "#FF9797", "#ff7575", "#FF2D2D",
        "#EA0000", "#AE0000", "#750000", "#4D0000", "#2F0000",
        "#FFD9EC", "#FFC1E0", "#ffaad5", "#FF79BC", "#FF60AF",
        "#FF359A", "#FF0080", "#D9006C", "#9F0050", "#600030",
        "#F1E1FF", "#E6CAFF", "#d3a4ff", "#BE77FF", "#9F35FF",
        "#8600FF", "#5B00AE", "#5B00AE", "#3A006F", "#28004D",
        "#DDDDFF", "#CECEFF", "#AAAAFF", "#7D7DFF", "#6A6AFF",
        "#4A4AFF", "#2828FF", "#0000E3", "#0000C6", "#000079",
        "#D9FFFF", "#CAFFFF", "#A6FFFF", "#4DFFFF", "#00E3E3",
        "#00AEAE", "#009393", "#007979", "#005757", "#003E3E",
        "#D7FFEE", "#C1FFE4", "#96FED1", "#4EFEB3", "#02F78E",
        "#02DF82", "#02C874", "#01B468", "#019858", "#006030",
        "#FFFFCE", "#FFFFAA", "#FFFF93", "#FFFF6F", "#FFFF37",
        "#F9F900", "#E1E100", "#A6A600", "#8C8C00", "#737300",
        "#FFE4CA", "#FFD1A4", "#FFC78E", "#FFBB77", "#FFA042",
        "#FF9224", "#FF8000", "#D26900", "#9F5000", "#844200",
        "#FFDAC8", "#FFCBB3", "#FFAD86", "#FF9D6F", "#FF8F59",
        "#FF8040", "#BB3D00", "#A23400", "#842B00", "#642100",

    ];
    var man1 = new Image();
    man1.src = "man1.png";
    var man2 = new Image();
    man2.src = "man2.png";
    var man3 = new Image();
    man3.src = "man3.png";
    var man4 = new Image();
    man4.src = "man4.png";


    var bgpic1 = new Image();
    bgpic1.src = "background/bg1.jpg";
    var bgpic2 = new Image();
    bgpic2.src = "background/bg2.jpg";
    var bgpic3 = new Image();
    bgpic3.src = "background/bg3.jpg";
    var bgpic4 = new Image();
    bgpic4.src = "background/bg4.jpg";
    var bgpic5 = new Image();
    bgpic5.src = "background/bg5.jpg";
    var bgpic6 = new Image();
    bgpic6.src = "background/bg6.jpg";
    var bgpic7 = new Image();
    bgpic7.src = "background/bg7.jpg";
    var bgpic8 = new Image();
    bgpic8.src = "background/bg8.jpg";
    var bgpic9 = new Image();
    bgpic9.src = "background/bg9.jpg";
    var bgpic10 = new Image();
    bgpic10.src = "background/bg10.jpg";
    var bgpic11 = new Image();
    bgpic11.src = "background/bg11.jpg";
    var bgpic12 = new Image();
    bgpic12.src = "background/bg12.jpg";

    var lay1 = new Image();
    lay1.src = "layout/lay1.png";
    var lay2 = new Image();
    lay2.src = "layout/lay2.png";
    var lay3 = new Image();
    lay3.src = "layout/lay3.png";


    var icon1 = new Image();
    icon1.src = "icon/icon1.png";
    var icon2 = new Image();
    icon2.src = "icon/icon2.png";
    var icon3 = new Image();
    icon3.src = "icon/icon3.png";
    var icon4 = new Image();
    icon4.src = "icon/icon4.png";
    var icon5 = new Image();
    icon5.src = "icon/icon5.png";
    var icon6 = new Image();
    icon6.src = "icon/icon6.png";
    var icon7 = new Image();
    icon7.src = "icon/icon7.png";
    ///// Move by Mouse
    canvas2.addEventListener('mousemove', mousemoveandler, false);
    canvas2.addEventListener('mousedown', mousedown, false);
    canvas2.addEventListener('mouseup', mouseup, false);
    rr.addEventListener('mousemove', rrmousemove, false);
    rr.addEventListener('mousedown', rrmousedown, false);
    dd.addEventListener('mousemove', ddmousemove, false);
    dd.addEventListener('mousedown', ddmousedown, false);


    var websocket;
    init();

    function init() {
        websocket = new WebSocket("ws://localhost:8085");
        websocket.onopen = function(evt) {
            // onOpen(evt)
        };

        websocket.onclose = function(evt) {
            // onClose(evt)
        };

        websocket.onmessage = function(evt) {
            onMessage(evt)
        };

        websocket.onerror = function(evt) {
            // onError(evt)
        };
    }

    function onMessage(evt) {

        try {
            var object = JSON.parse(evt.data);

            switch (object.name) {
                case "point":
                    var obj = JSON.parse(object.object);
                    //initialX, initialY, afterX, afterY, width, color
                    var point = new Point(obj.initialX, obj.initialY, obj.afterX, obj.afterY, obj.width, obj.color);
                    point.draw(ctx2);
                    break;
                case "picture":
                    var obj = JSON.parse(object.object);
                    pictures = [];
                    for (var i = 0; i < obj.length; i++) {

                        pictures.push(obj[i]);
                        // pic.src = obj[i];
                        drawImg(obj[i]);
                    }

                    break;
            }
        } catch (e) {

        }

    }

    function Command(name, object) {
        this.name = name;
        this.object = object;
    }

    Command.prototype.send = function() {
        ws.broadcast(JSON.stringify(this));
    };

    ////////////////////////    
    function mousemoveandler(e) {
        var rect = canvas2.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        if (drawMode) {
            var point = new Point(currentMouseX, currentMouseY, mouseX, mouseY, lineWidth, hex);
            // Draw it on the background canvas.
            point.draw(ctx2);

            // Send it to the sever.
            pushPath(point);

            // Refresh old coordinates
            currentMouseX = mouseX;
            currentMouseY = mouseY;
        }

    }

    function mouseup(e) {
        var rect = canvas2.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        var point = new Point(currentMouseX, currentMouseY, mouseX, mouseY, lineWidth, hex);
        point.draw(ctx2);

        // Send it to the sever.
        pushPath(point);

        // Refresh old coordinates
        currentMouseX = mouseX;
        currentMouseY = mouseY;

        drawMode = false;
        ctx2.closePath();

    }

    function mousedown(e) {
        var rect = canvas2.getBoundingClientRect();
        currentMouseX = e.clientX - rect.left;
        currentMouseY = e.clientY - rect.top;
        drawMode = true;

    }

    function pushPath(point) {
        websocket.send(JSON.stringify(new Command("point", JSON.stringify(point))));
    }
    /////////////////
    function rrmousemove(e) {

    }

    function rrmousedown(e) {
        var rect = rr.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        //console.log(x+"="+y);
        if (rrset == 3) {
            if (x >= 100 && x <= 250 && y >= 390 && y <= 415) {
                sizex = x - 5;
                lineWidth = (x - 100) / 8;
            } else {
                p = ctx3.getImageData(x, y, 1, 1).data;
                hex = rgbToHex(p[0], p[1], p[2]);
            }
        } else if (x >= 60 && x <= 60 + 120 && y >= 70 && y <= 70 + 120) {
            switch (rrset) {
                case 1:
                    bg = 1;
                    break;
                case 2:
                    lay = 1;
                    break;

            }
        } else if (x >= 180 && x <= 180 + 120 && y >= 70 && y <= 70 + 120) {
            switch (rrset) {
                case 1:
                    bg = 2;
                    break;
                case 2:
                    lay = 2;
                    break;

            }

        } else if (x >= 300 && x <= 300 + 120 && y >= 70 && y <= 70 + 120) {
            switch (rrset) {
                case 1:
                    bg = 3;
                    break;
                case 2:
                    lay = 3;
                    break;

            }
        } else bg = 0;
        render();
    }

    function ddmousemove(e) {
        var x = e.clientX;

    }

    function ddmousedown(e) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        //alert(x+"=="+y);
        if (x >= 10 && x <= 10 + 60 && y >= 670 && y <= 670 + 50) {
            rrset = 1;
        } else if (x >= 80 && x <= 80 + 60 && y >= 670 && y <= 670 + 50) {
            rrset = 2;
        } else if (x >= 150 && x <= 150 + 60 && y >= 670 && y <= 670 + 50) {
            rrset = 3;
        } else if (x >= 220 && x <= 220 + 60 && y >= 670 && y <= 670 + 50) {
            rrset = 4;
        } else if (x >= 290 && x <= 290 + 60 && y >= 670 && y <= 670 + 50) {
            rrset = 5;
        } else if (x >= 360 && x <= 360 + 60 && y >= 670 && y <= 670 + 50) {
            rrset = 6;
        } else if (x >= 430 && x <= 430 + 60 && y >= 670 && y <= 670 + 50) {
            rrset = 7;

            //var img1 = new Image();
            //img1.src = canvas2.toDataURL("image/png");


        } else rrset = 0;
        //alert(rrset);
        render();

    }

    function render() {

        if (bg == 1) ctx.drawImage(bgpic1, 0, 0, canvas.width, canvas.height);
        else if (bg == 2) ctx.drawImage(bgpic2, 0, 0, canvas.width, canvas.height);
        else if (bg == 3) ctx.drawImage(bgpic3, 0, 0, canvas.width, canvas.height);
        if (lay == 1) ctx.drawImage(lay1, 0, 0, canvas.width, canvas.height);
        else if (lay == 2) ctx.drawImage(lay2, 0, 0, canvas.width, canvas.height);
        else if (lay == 3) ctx.drawImage(lay3, 0, 0, canvas.width, canvas.height);

        if (rrset == 1) {
            ctx3.clearRect(0, 0, canvas.width, canvas.height);
            ctx3.drawImage(bgpic1, 60, 70, 120, 120);
            ctx3.drawImage(bgpic2, 180, 70, 120, 120);
            ctx3.drawImage(bgpic3, 300, 70, 120, 120);
            ctx3.drawImage(bgpic4, 60, 190, 120, 120);
            ctx3.drawImage(bgpic5, 180, 190, 120, 120);
            ctx3.drawImage(bgpic6, 300, 190, 120, 120);
            ctx3.drawImage(bgpic7, 60, 310, 120, 120);
            ctx3.drawImage(bgpic8, 180, 310, 120, 120);
            ctx3.drawImage(bgpic9, 300, 310, 120, 120);
            ctx3.drawImage(bgpic10, 60, 430, 120, 120);
            ctx3.drawImage(bgpic11, 180, 430, 120, 120);
            ctx3.drawImage(bgpic12, 300, 430, 120, 120);
        } else if (rrset == 2) {
            ctx3.clearRect(0, 0, canvas.width, canvas.height);
            ctx3.drawImage(lay1, 60, 70, 120, 120);
            ctx3.drawImage(lay2, 180, 70, 120, 120);
            ctx3.drawImage(lay3, 300, 70, 120, 120);
        } else if (rrset == 3) {
            ctx3.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    ctx3.fillStyle = color[i * 10 + j];
                    ctx3.fillRect(70 + 32 * j, 40 + 32 * i, 30, 30);
                }

            }
            ctx3.fillStyle = hex;
            ctx3.moveTo(100, 400);
            ctx3.lineTo(250, 390);
            ctx3.lineTo(250, 410);
            ctx3.closePath();
            ctx3.fill();
            ctx3.fillStyle = "#000000";
            ctx3.fillRect(sizex, 385, 10, 30);
        } else if (rrset == 4) {

        }
        ctx4.clearRect(0, 0, dd.width, dd.height);
        ctx4.drawImage(icon2, 10, 20, 50, 50);
        ctx4.drawImage(icon1, 80, 20, 50, 50);
        ctx4.drawImage(icon3, 150, 20, 50, 50);
        ctx4.drawImage(icon4, 220, 20, 50, 50);
        ctx4.drawImage(icon6, 290, 20, 50, 50);
        ctx4.drawImage(icon7, 360, 20, 50, 50);
        ctx4.drawImage(icon5, 430, 20, 50, 50);

        ctx4.drawImage(man1, 600, 20, 50, 50);
        ctx4.drawImage(man2, 670, 20, 50, 50);
        ctx4.drawImage(man3, 740, 20, 50, 50);
        ctx4.drawImage(man4, 810, 20, 50, 50);

    }

    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {

                ctx2.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    //render();
    //setInterval(render, 100);
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function downloadCanvas(link, canvasId, filename) {
        link.href = document.getElementById(canvasId).toDataURL();
        link.download = filename;
    }
    document.getElementById('download').addEventListener('click', function() {
        ctx.drawImage(canvas2, 0, 0);
        downloadCanvas(this, 'canvas', 'test.png');
    }, false);
    render();
