var canvas = document.getElementById("pictureLayer");
var ctx = canvas.getContext("2d");

// var canvasOffset = canvas.offset();
var offsetX = canvas.offsetLeft;
var offsetY = canvas.offsetTop;

var isDown = false;
var cx = canvas.width / 2;
var cy = canvas.height / 2;

var pi2 = Math.PI * 2;
var resizerRadius = 15;
var rr = resizerRadius * resizerRadius;
var draggingResizer = {
    x: 0,
    y: 0
};
var imageWidth, imageHeight, imageRight, imageBottom;
var image1Width, image1Height, image1Right, image1Bottom;
var draggingImage = false;
var startX;
var startY;

//photo focus 
var photoFocus = -1;
var tempFocus = -1;
var photos = new Array();
var tempphoto;

function Photos(obj, initialX, initialY, width, height, r, selected) {
    this.obj = obj;
    this.initialX = initialX;
    this.initialY = initialY;
    this.width = width;
    this.height = height;
    this.Right = initialX + this.width;
    this.Bottom = initialY + this.height;
    this.r = r;
    this.selected = selected;
}

function draw(withAnchors, withBorders, flag) {

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("length: " + photos.length);

    var imgList = [];
    for (var j = 0; j < photos.length; j++) {
        var img = new Image();
        img.onload = function() {
            if (imgList.length == photos.length) {
                for (var i = 0; i < photos.length; i++) {
                    // pictureContext.translate(cx, cy);
                    // pictureContext.rotate(photos[i].r);

                    if (photos[i].selected != -1) {
                        photoFocus = photos[i].selected;
                        drawBorder(i);
                        drawTLAnchor(photos[i].initialX, photos[i].initialY);
                        drawRBAnchor(photos[i].Right, photos[i].Bottom);
                    }
                    pictureContext.drawImage(imgList[i], photos[i].initialX, photos[i].initialY, photos[i].width, photos[i].height);

                }
            }
        }
        img.src = photos[j].obj;
        imgList.push(img);
    }

    if (flag != 0) {
        if (withBorders >= 0) {
            drawBorder(withBorders);
        }

        if (withAnchors >= 0) {
            drawTLAnchor(photos[withAnchors].initialX, photos[withAnchors].initialY);
            drawRBAnchor(photos[withAnchors].Right, photos[withAnchors].Bottom);
        }
    } else if (photoFocus >= 0) {
        drawTLAnchor(photos[withAnchors].initialX, photos[withAnchors].initialY);
        drawRBAnchor(photos[withAnchors].Right, photos[withAnchors].Bottom);
    }
}

function drawDragAnchor(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, resizerRadius, 0, pi2, false);
    ctx.closePath();
    ctx.fill();
}

function drawBorder(id) {
    ctx.beginPath();
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 1;
    ctx.moveTo(photos[id].initialX, photos[id].initialY);
    ctx.lineTo(photos[id].Right, photos[id].initialY);
    ctx.lineTo(photos[id].Right, photos[id].Bottom);
    ctx.lineTo(photos[id].initialX, photos[id].Bottom);
    ctx.closePath();
    ctx.stroke();
}

function drawRBAnchor(x, y) {
    var RB = new Image();
    RB.src = "img/operation.png";
    ctx.drawImage(RB, x - 25, y - 25);
}

function drawTLAnchor(x, y) {
    var RB = new Image();
    RB.src = "img/delete.png";
    ctx.drawImage(RB, x - 23, y - 20);
}

function anchorHitTest(x, y) {

    var dx, dy;

    if (photoFocus >= 0) {
        // top-left
        dx = x - photos[photoFocus].initialX;
        dy = y - photos[photoFocus].initialY;

        if (dx * dx + dy * dy <= rr) {
            return (0);
        }
        // top-right
        dx = x - photos[photoFocus].Right;
        dy = y - photos[photoFocus].initialY;
        if (dx * dx + dy * dy <= rr) {
            return (1);
        }
        // bottom-right
        dx = x - photos[photoFocus].Right;
        dy = y - photos[photoFocus].Bottom;
        if (dx * dx + dy * dy <= rr) {
            return (4);
        }
        // bottom-left
        dx = x - photos[photoFocus].initialX;
        dy = y - photos[photoFocus].Bottom;
        if (dx * dx + dy * dy <= rr) {
            return (3);
        }
        return (-1);
    } else {
        return (-1);
    }

}

/* 0/1/2   photo0/photo1/photo2*/
function hitImage(x, y) {
    for (var i = 0; i < photos.length; i++) {
        if (x > photos[i].initialX && x < photos[i].initialX + photos[i].width &&
            y > photos[i].initialY && y < photos[i].initialY + photos[i].height) {
            //alert(i);
            return (i);
        }
    }
    return (-1);
}

function handleMouseDown(e) {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    photoFocus = hitImage(startX, startY);

    //alert(photoFocus);
    draggingResizer = anchorHitTest(startX, startY);
    //alert(draggingResizer);
    //draggingImage = draggingResizer < 0 && (photoFocus+1);
    draggingImage = photoFocus;
    if (photoFocus >= 0) {
        photos[photoFocus].selected = photoFocus;
        draw(photoFocus, photoFocus);
    } else {
        draw(-1, -1);
    }
}

function handleMouseUp(e) {
    draggingResizer = -1;
    draggingImage = -1;
    doSend(JSON.stringify(new Command("picture", JSON.stringify(photos))));
}

function handleMouseOut(e) {
    handleMouseUp(e);
}

function handleMouseMove(e) {

    if (draggingResizer > -1) {

        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // resize the image
        switch (draggingResizer) {
            case 0:
                //top-left
                photos[photoFocus].initialX = mouseX;
                photos[photoFocus].width = photos[photoFocus].Right - mouseX;
                photos[photoFocus].initialY = mouseY;
                photos[photoFocus].height = photos[photoFocus].Bottom - mouseY;
                break;
            case 1:
                //top-right
                photos[photoFocus].initialY = mouseY;
                photos[photoFocus].width = mouseX - photos[photoFocus].initialX;
                photos[photoFocus].height = photos[photoFocus].Bottom - mouseY;
                break;
            case 2:
                //bottom-right
                photos[photoFocus].width = mouseX - photos[photoFocus].initialX;
                photos[photoFocus].height = mouseY - photos[photoFocus].initialY;
                break;
            case 3:
                //bottom-left
                photos[photoFocus].initialX = mouseX;
                photos[photoFocus].width = photos[photoFocus].Right - mouseX;
                photos[photoFocus].height = mouseY - photos[photoFocus].initialY;
                break;
            case 4:
                var dx = mouseX - cx;
                var dy = mouseY - cy;
                var angle = Math.atan2(dy, dx);
                photos[photoFocus].r = angle;
                break;
        }

        if (photos[photoFocus].width < 25) {
            photos[photoFocus].width = 25;
        }
        if (photos[photoFocus].height < 25) {
            photos[photoFocus].height = 25;
        }

        // set the image right and bottom
        photos[photoFocus].Right = photos[photoFocus].initialX + photos[photoFocus].width;
        photos[photoFocus].Bottom = photos[photoFocus].initialY + photos[photoFocus].height;

        // redraw the image with resizing anchors
        draw(photoFocus, photoFocus);
    } else if (draggingImage >= 0 && photoFocus >= 0) {
        imageClick = false;

        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // move the image by the amount of the latest drag
        var dx = mouseX - startX;
        var dy = mouseY - startY;
        photos[photoFocus].initialX += dx;
        photos[photoFocus].initialY += dy;
        photos[photoFocus].Right += dx;
        photos[photoFocus].Bottom += dy;
        // reset the startXY for next time
        startX = mouseX;
        startY = mouseY;

        // redraw the image with border
        draw(photoFocus, photoFocus);
    }
}

mouseLayer.onmousedown = function(e) {
    handleMouseDown(e);
};
mouseLayer.onmousemove = function(e) {
    handleMouseMove(e);
};
mouseLayer.onmouseup = function(e) {
    handleMouseUp(e);
};
mouseLayer.onmouseout = function(e) {
    handleMouseOut(e);
};
