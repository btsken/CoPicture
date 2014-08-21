var stamps = new Array();

function Stamps(url, initialX, initialY, width, height) {
	this.url;
    this.initialX = initialX;
    this.initialY = initialY;
    this.width = width;
    this.height = height;
    this.Right = initialX + this.width;
    this.Bottom = initialY + this.height;
}

//Delete Stamp
function deleteStamp() {
    stamps.splice(stampFocus, 1);
    draw(-1, -1, -1, -1);
}
