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
var draggingText = false;
var draggingTextResizer = -1;
var startX;
var startY;
var isRotate = false;

//photo focus 
var photoFocus = -1;
var tempFocus = -1;
var textboxFocus = -1;
var photos = new Array();
var textboxes = [];
var tempphoto;
var imgList = [];

function PhotosNoBase64(initialX, initialY, width, height, r, selected) {
    this.initialX = initialX;
    this.initialY = initialY;
    this.width = width;
    this.height = height;
    this.Right = initialX + this.width;
    this.Bottom = initialY + this.height;
    this.r = r;
    this.selected = selected;
}

function drawNew() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    imgList = [];
    for (var j = 0; j < photos.length; j++) {
        var img = new Image();
        img.onload = function() {
            if (imgList.length == photos.length) {
                for (var i = 0; i < photos.length; i++) {

                    var pic = new Photos(photos[i].obj, photos[i].initialX,
                        photos[i].initialY, photos[i].width, photos[i].height, photos[i].r, photos[i].selected);

                    if (pic.selected != -1) {
                        if (i == photoFocus) {
                            pic.drawBorder(usercolor[myid - 1]);
                        } else {
                            pic.drawBorder();
                        }
                    }
                    drawRotatedImage(imgList[i], photos[i]);
                    if (pic.selected != -1) {
                        pic.drawTLAnchor();
                        pic.drawRBAnchor();
                    }
                }
            }
        }
        img.src = photos[j].obj;
        imgList.push(img);
    }

    for (var i = 0; i < textboxes.length; i++) {
        var textObj = new Textboxes(textboxes[i].fontsize, textboxes[i].value,
            textboxes[i].initialX, textboxes[i].initialY, textboxes[i].width,
            textboxes[i].height, textboxes[i].selected);


        if (textObj.selected != -1) {

            if (i == textboxFocus) {
                textObj.drawBorder(usercolor[myid - 1]);
            } else {
                textObj.drawBorder();
            }

        }
        var fontsize = textboxes[i].fontsize;
        var strFont = fontsize + "px Times New Roman bold";
        ctx.font = strFont;
        ctx.fillStyle = '#000';
        ctx.fillText(textboxes[i].value, textboxes[i].initialX, textboxes[i].initialY, textboxes[i].width, textboxes[i].height);
        if (textObj.selected != -1) {
            textObj.drawTLAnchor();
            textObj.drawRBAnchor();
        }
    }
}

function draw() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < photos.length; i++) {
        var pic = new Photos(photos[i].obj, photos[i].initialX,
            photos[i].initialY, photos[i].width, photos[i].height, photos[i].r, photos[i].selected);

        if (pic.selected != -1) {
            if (i == photoFocus) {
                pic.drawBorder(usercolor[myid - 1]);
            } else {
                pic.drawBorder();
            }
        }
        drawRotatedImage(imgList[i], photos[i]);
        if (pic.selected != -1) {
            pic.drawTLAnchor();
            pic.drawRBAnchor();
        }
    }

    for (var i = 0; i < textboxes.length; i++) {
        //Textboxes(size, value, x, y, width, height, selected)
        var textObj = new Textboxes(textboxes[i].fontsize, textboxes[i].value,
            textboxes[i].initialX, textboxes[i].initialY, textboxes[i].width,
            textboxes[i].height, textboxes[i].selected);

        if (textObj.selected != -1) {

            if (i == textboxFocus) {
                textObj.drawBorder(usercolor[myid - 1]);
            } else {
                textObj.drawBorder();
            }

        }
        var fontsize = textboxes[i].fontsize;
        var strFont = fontsize + "px Times New Roman bold";
        ctx.font = strFont;
        ctx.fillStyle = '#000';
        ctx.fillText(textboxes[i].value, textboxes[i].initialX, textboxes[i].initialY, textboxes[i].width, textboxes[i].height);
        if (textObj.selected != -1) {
            textObj.drawTLAnchor();
            textObj.drawRBAnchor();
        }
    }
}

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

Photos.prototype.drawBorder = function(color) {
    // ctx.save();

    // var img = new Image();
    // img.src = "img/border.png";

    // ctx.translate(this.width / 2, this.height / 2);
    // ctx.translate(this.initialX, this.initialY);
    // ctx.rotate(this.r);
    // ctx.drawImage(img, -this.width / 2 - 5, -this.height / 2 - 5,
    //     this.width + 10, this.height + 10);
    // ctx.restore();

    ctx.beginPath();
    if (arguments.length == 1) {
        ctx.strokeStyle = color;
    } else {
        ctx.strokeStyle = '#000000';
    }

    ctx.lineWidth = 3;
    ctx.moveTo(this.initialX, this.initialY);
    ctx.lineTo(this.Right, this.initialY);
    ctx.lineTo(this.Right, this.Bottom);
    ctx.lineTo(this.initialX, this.Bottom);
    ctx.closePath();
    ctx.stroke();
};

Photos.prototype.drawRBAnchor = function() {
    var RB = new Image();
    RB.src = "img/operation.png";

    ctx.drawImage(RB, this.Right - 25, this.Bottom - 25);

    // var radius = Math.sqrt(Math.pow(this.width / 2, 2), Math.pow(this.height / 2, 2));

    // ctx.save();
    // ctx.translate((this.initialX + this.width) / 2, (this.initialY + this.height) / 2);
    // ctx.rotate(this.r);
    // ctx.translate((this.initialX + this.width) / -2, (this.initialY + this.height) / -2);
    // ctx.drawImage(RB, this.Right - RB.width / 2, this.Bottom - RB.height / 2);
    // ctx.restore();


};

Photos.prototype.drawRotationHandle = function() {
    ctx.save();
    ctx.translate(this.initialX + this.width, this.initialY + this.height / 2);
    ctx.rotate(this.r);
    ctx.beginPath();
    ctx.moveTo(0, -1);

    var w = this.width / 2;
    ctx.lineTo(w / 8 + 20, -1);
    ctx.lineTo(w / 8 + 20, -7);
    ctx.lineTo(w / 8 + 30, -7);
    ctx.lineTo(w / 8 + 30, 7);
    ctx.lineTo(w / 8 + 20, 7);
    ctx.lineTo(w / 8 + 20, 1);
    ctx.lineTo(0, 1);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.restore();
}

Photos.prototype.drawTLAnchor = function() {
    var RB = new Image();
    RB.src = "img/delete.png";
    var w = this.initialX - RB.width / 2,
        h = this.initialY - RB.height / 2;

    ctx.drawImage(RB, w, h);

    // ctx.save();
    // ctx.translate((this.initialX + this.width) / 2, (this.initialY + this.height) / 2);
    // ctx.rotate(this.r);
    // ctx.translate((this.initialX + this.width) / -2, (this.initialY + this.height) / -2);
    // ctx.drawImage(RB, w, h);
    // ctx.restore();

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
            return (2);
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
            return (2);
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

function anchorTextHitTest(x, y) {

    var dx, dy;

    if (textboxFocus >= 0) {
        // top-left
        dx = x - textboxes[textboxFocus].initialX;
        dy = y - (textboxes[textboxFocus].initialY - textboxes[textboxFocus].height);

        if (dx * dx + dy * dy <= rr) {
            //alert("hit");
            return (0);
        }
        // top-right
        dx = x - textboxes[textboxFocus].Right;
        dy = y - (textboxes[textboxFocus].initialY - textboxes[textboxFocus].height);
        if (dx * dx + dy * dy <= rr) {
            //alert("hit");
            return (1);
        }
        // bottom-right
        dx = x - textboxes[textboxFocus].Right;
        dy = y - textboxes[textboxFocus].initialY;
        if (dx * dx + dy * dy <= rr) {
            //alert("hit");
            return (2);
        }
        // bottom-left
        dx = x - textboxes[textboxFocus].initialX;
        dy = y - textboxes[textboxFocus].initialY;
        if (dx * dx + dy * dy <= rr) {
            //alert("hit");
            return (3);
        }
        return (-1);
    } else {
        return (-1);
    }
}

function getPicObj(pic) {
    return new Photos(pic.obj, pic.initialX,
        pic.initialY, pic.width, pic.height, pic.r, pic.selected);
}

function drawRotatedImage(image, picObj) {
    pictureContext.save();
    pictureContext.translate(picObj.width / 2, picObj.height / 2);
    pictureContext.translate(picObj.initialX, picObj.initialY);

    pictureContext.rotate(picObj.r);
    pictureContext.drawImage(image, -picObj.width / 2, -picObj.height / 2,
        picObj.width, picObj.height);
    // pictureContext.drawImage(image, 0, 0, picObj.width, picObj.height,
    //     picObj.width / -4, picObj.height / -4, picObj.width / 2, picObj.height / 2);
    pictureContext.restore();
}

/* 0/1/2   photo0/photo1/photo2*/
function hitImage(x, y) {
    for (var i = 0; i < photos.length; i++) {
        if (x > photos[i].initialX && x < photos[i].initialX + photos[i].width + 25 &&
            y > photos[i].initialY && y < photos[i].initialY + photos[i].height + 25) {
            photos[i].selected = i;
            return (i);
        } else {
            // photos[i].selected = -1;
        }
    }
    return (-1);
}

function hitTextbox(x, y) {
    for (var i = 0; i < textboxes.length; i++) {
        if (x > textboxes[i].initialX && x < textboxes[i].Right &&
            y > textboxes[i].initialY - textboxes[i].height && y < textboxes[i].initialY) {
            textboxes[i].selected = i;
            return (i);
        } else {
            // textboxes[i].selected = -1;
        }
    }
    return (-1);
}

function handleMouseDown(e) {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    // mine
    var nowClick = hitImage(startX, startY);
    var nowClickText = hitTextbox(startX, startY);

    if (nowClickText == -1) {

        if (nowClick == -1) {
            draggingResizer = -1;
        } else {
            var pic = getPicObj(photos[nowClick]);
            draggingResizer = pic.anchorHitTest(startX, startY);
        }

        if (draggingResizer == 0) {
            photos.splice(nowClick, 1);
            imgList.splice(nowClick, 1);
            doSend(JSON.stringify(new Command("newPicture", JSON.stringify(photos))));
            // draw();
            return;
        }

        draggingImage = photoFocus;
        if (nowClick >= 0) {
            if (photoFocus != -1) {
                photos[photoFocus].selected = -1;
            }
            photoFocus = nowClick;
            photos[nowClick].selected = nowClick;

            if (textboxFocus != -1) {
                textboxes[textboxFocus].selected = -1;
            }

            draw();
        } else {
            draggingImage = -1;
            if (photoFocus != -1) {
                photos[photoFocus].selected = nowClick;
            }
            draw();
        }
    }

    if (nowClick == -1) {


        if (nowClickText == -1) {
            draggingTextResizer = -1;
        } else {
            draggingTextResizer = anchorTextHitTest(startX, startY);
        }

        draggingText = textboxFocus;
        if (nowClickText >= 0) {
            if (textboxFocus != -1) {
                textboxes[textboxFocus].selected = -1;
            }
            textboxFocus = nowClickText;
            textboxes[nowClickText].selected = nowClickText;


            if (photoFocus != -1) {
                photos[photoFocus].selected = -1;
            }

            draw();
        } else {
            draggingText = -1;
            if (textboxFocus != -1) {
                textboxes[textboxFocus].selected = nowClickText;
            }
            draw();
        }

        //Delete Textbox
        if (draggingTextResizer == 0) {
            textboxes.splice(nowClickText, 1);
            textboxFocus = -1;
            draw();
            return;
        }
    }
}

function handleMouseUp(e) {
    draggingTextResizer = -1;
    draggingResizer = -1;
    draggingImage = -1;
    draggingText = -1;

    // textboxFocus = -1;
    // photoFocus = -1;

    var noBase64 = [];
    for (var i = 0; i < photos.length; i++) {
        var pic = new PhotosNoBase64(photos[i].initialX, photos[i].initialY,
            photos[i].width, photos[i].height, photos[i].r, photos[i].selected);
        noBase64.push(pic);
    }
    // console.log(JSON.stringify(noBase64));
    doSend(JSON.stringify(new Command("picture", JSON.stringify(noBase64))));
    console.log(JSON.stringify(textboxes));
    doSend(JSON.stringify(new Command("text", JSON.stringify(textboxes))));
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
        draw();
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
        draw();
    }

    //Do TextBox Resize or Move
    if (draggingTextResizer > -1) {
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        //Do textbox resize
        if (draggingTextResizer == 2) {
            if ((mouseX - startX) > 0 && (mouseY - startY) > 0) {
                textboxes[textboxFocus].fontsize += 1;
                textboxes[textboxFocus].Right += 2;
                textboxes[textboxFocus].width += 2;
                textboxes[textboxFocus].height += 1;
            } else if ((mouseX - startX) < 0 && (mouseY - startY) < 0) {
                textboxes[textboxFocus].fontsize -= 1;
                textboxes[textboxFocus].Right -= 2;
                textboxes[textboxFocus].width += 2;
                textboxes[textboxFocus].height -= 1;
            }
            if (textboxes[textboxFocus].Right < textboxes[textboxFocus].initialX + 100) {
                textboxes[textboxFocus].Right = textboxes[textboxFocus].initialX + 100;
            };
            if (textboxes[textboxFocus].width < 100) {
                textboxes[textboxFocus].width = 100;
            };
            if (textboxes[textboxFocus].height < 30) {
                textboxes[textboxFocus].height = 30;
            };
        }
        if (textboxes[textboxFocus].fontsize < 25) {
            textboxes[textboxFocus].fontsize = 25
        };
        draw();
    } else if (draggingText >= 0 && textboxFocus >= 0) {
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // move the image by the amount of the latest drag
        var dx = mouseX - startX;
        var dy = mouseY - startY;
        textboxes[textboxFocus].initialX += dx;
        textboxes[textboxFocus].initialY += dy;
        textboxes[textboxFocus].Right += dx;
        textboxes[textboxFocus].Bottom += dy;
        // reset the startXY for next time
        startX = mouseX;
        startY = mouseY;
        draw();
    }
}

mouseLayer.onmousedown = function(e) {
    if (modeFlag != 1) {
        handleMouseDown(e);
    }
};
mouseLayer.onmousemove = function(e) {
    if (modeFlag != 1) {
        handleMouseMove(e);
    }
};
mouseLayer.onmouseup = function(e) {
    if (modeFlag != 1) {
        handleMouseUp(e);
    }
};
mouseLayer.onmouseout = function(e) {
    if (modeFlag != 1) {
        handleMouseOut(e);
    }
};
