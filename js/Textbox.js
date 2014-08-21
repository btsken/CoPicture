var text_template = document.getElementById("text_template");
var text_input = document.getElementById("input_textbox");
var text_confirm = document.getElementById("input_confirm");
var text_cancel = document.getElementById("input_cancel");
var textboxes = new Array();

function Textboxes(size, value, x, y, width, height, selected) {
    this.fontsize = size;
    this.value = value;
    this.initialX = x;
    this.initialY = y;
    this.width = width;
    this.height = height;
    this.Right = x + this.width;
    this.Bottom = y + this.height;
    this.selected = selected;
}

function input_text() {
    text_template.style.display = "inline";
    text_input.style.display = "inline";
    text_confirm.style.display = "inline";
    text_cancel.style.display = "inline";
}

function input_confirm() {
    var fontsize = 50;
    //Do Savetext Array()
    // var text = new Textboxes(fontsize, text_input.value, 800, 300, (text_input.value.length) * 50, 40, -1);
    var text = new Textboxes(fontsize, text_input.value, 800, 300,
        ctx.measureText(text_input.value).width, 40, -1);
    textboxes.push(text);

    doSend(JSON.stringify(new Command("text", JSON.stringify(textboxes))));

    //Do diplay none;
    text_input.value = '';
    text_template.style.display = "none";
    text_input.style.display = 'none';
    text_confirm.style.display = 'none';
    text_cancel.style.display = 'none';
}

function input_cancel() {
    text_input.value = '';
    text_template.style.display = "none";
    text_input.style.display = 'none';
    text_confirm.style.display = 'none';
    text_cancel.style.display = 'none';
}

function deleteTextbox() {
    textboxes.splice(textboxFocus, 1);
    draw();
}

Textboxes.prototype.drawBorder = function(color) {
    ctx.beginPath();

    if (arguments.length == 1) {
        ctx.strokeStyle = color;
    } else {
        ctx.strokeStyle = '#000000';
    }

    ctx.lineWidth = 3;
    ctx.moveTo(this.initialX, this.initialY + 10);
    ctx.lineTo(this.Right, this.initialY + 10);
    ctx.lineTo(this.Right, this.initialY - this.height);
    ctx.lineTo(this.initialX, this.initialY - this.height);
    ctx.closePath();
    ctx.stroke();
};

Textboxes.prototype.drawRBAnchor = function() {
    var RB = new Image();
    RB.src = "img/operation.png";

    ctx.drawImage(RB, this.Right - RB.width / 2, this.initialY - RB.height / 2);
};

Textboxes.prototype.drawTLAnchor = function() {
    var RB = new Image();
    RB.src = "img/delete.png";
    var w = this.initialX - RB.width / 2,
        h = this.initialY - this.height - RB.height / 2;

    ctx.drawImage(RB, w, h);
};
