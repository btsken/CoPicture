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

Photos.prototype.drawDragAnchor = function() {
    ctx.beginPath();
    ctx.arc(this.initialX, this.initialY, resizerRadius, 0, pi2, false);
    ctx.closePath();
    ctx.fill();
};

Photos.prototype.drawBorder = function() {
    ctx.save();
    ctx.rotate(this.r);
    ctx.beginPath();
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 1;
    ctx.moveTo(this.initialX, this.initialY);
    ctx.lineTo(this.Right, this.initialY);
    ctx.lineTo(this.Right, this.Bottom);
    ctx.lineTo(this.initialX, this.Bottom);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
};

Photos.prototype.drawRBAnchor = function() {
    var RB = new Image();
    RB.src = "img/operation.png";
    // pictureContext.save();
    // pictureContext.translate(this.initialX, this.initialY);

    ctx.drawImage(RB, this.Right - 25, this.Bottom - 25);

    // pictureContext.restore();
};

Photos.prototype.drawTLAnchor = function() {
    var RB = new Image();
    RB.src = "img/delete.png";


    ctx.drawImage(RB, this.initialX - 23, this.initialY - 20);

};

Photos.prototype.anchorHitTest = function(x, y) {
    var dx, dy;

    if (this.selected != -1) {
        // top-left
        dx = x - this.initialX;
        dy = y - this.initialY;

        if (dx * dx + dy * dy <= rr) {
            return (0);
        }
        // top-right
        dx = x - this.Right;
        dy = y - this.initialY;
        if (dx * dx + dy * dy <= rr) {
            return (1);
        }
        // bottom-right
        dx = x - this.Right;
        dy = y - this.Bottom;
        if (dx * dx + dy * dy <= rr) {
            console.log("rotate");
            return (4);
        }
        // bottom-left
        dx = x - this.initialX;
        dy = y - this.Bottom;
        if (dx * dx + dy * dy <= rr) {
            return (3);
        }
        return (-1);
    } else {
        return (-1);
    }
};

function getPicObj(pic) {
    return new Photos(pic.obj, pic.initialX,
        pic.initialY, pic.width, pic.height, pic.r, pic.selected);
}

function drawRotatedImage(image, picObj) {
    pictureContext.save();
    pictureContext.translate(picObj.initialX, picObj.initialY);

    // picObj.initialX += picObj.initialX;
    // picObj.initialY += picObj.initialY;

    pictureContext.rotate(picObj.r);
    // pictureContext.drawImage(image, -(picObj.width / 2), -(picObj.height / 2));
    pictureContext.drawImage(image, 0, 0, picObj.width, picObj.height);
    pictureContext.restore();
}

function draw() {

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var imgList = [];
    for (var j = 0; j < photos.length; j++) {
        var img = new Image();
        img.onload = function() {
            if (imgList.length == photos.length) {
                for (var i = 0; i < photos.length; i++) {


                    if (photos[i].selected != -1) {
                        // obj, initialX, initialY, width, height, r, selected
                        var pic = getPicObj(photos[i]);
                        // pic.drawBorder();
                        pic.drawTLAnchor();
                        pic.drawRBAnchor();
                    }

                    drawRotatedImage(imgList[i], photos[i]);
                }
            }
        }
        img.src = photos[j].obj;
        imgList.push(img);
    }
}

/* 0/1/2   photo0/photo1/photo2*/
function hitImage(x, y) {
    for (var i = 0; i < photos.length; i++) {
        if (x > photos[i].initialX && x < photos[i].initialX + photos[i].width + 25 &&
            y > photos[i].initialY && y < photos[i].initialY + photos[i].height + 25) {
            photos[i].selected = i;
            return (i);
        }
    }
    return (-1);
}

function handleMouseDown(e) {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    var nowClick = hitImage(startX, startY);

    // photoFocus = hitImage(startX, startY);


    if (nowClick == -1) {
        draggingResizer = -1;
    } else {
        var pic = getPicObj(photos[nowClick]);
        draggingResizer = pic.anchorHitTest(startX, startY);
    }

    draggingImage = photoFocus;
    if (nowClick >= 0) {
        if (photoFocus != -1) {
            photos[photoFocus].selected = -1;
        }
        photoFocus = nowClick;
        photos[nowClick].selected = nowClick;
        draw(photoFocus, photoFocus);
    } else {
        if (photoFocus != -1) {
            photos[photoFocus].selected = nowClick;
        }
        draw();
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
                // photos[photoFocus].initialX -= photos[photoFocus].width / 2;
                // photos[photoFocus].initialY -= photos[photoFocus].height / 2;

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
