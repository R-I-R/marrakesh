/*
    Code made by RIR
    © 2019-2019 TETjs, All Rights Reserved

*/


class __Game__ {
    constructor(width = 500, height = 500, fps = 50) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.fps = fps;
        this.isStop = true;
        this.ticks = 0;
        this.isMouseDown = false;
        this.isDrag = false;

        this.canvas.onmousemove = e => {
            e.preventDefault();
            e.stopPropagation();

            if (!this.isStop) {
                this.onmousemove(e.layerX, e.layerY, e.buttons, e.ctrlKey, e.shiftKey, e.altKey);
                if (this.isMouseDown) {
                    if (this.mouseStartX != e.layerX || this.mouseStartY != e.layerY) {
                        this.ondrag(this.mouseStartX, this.mouseStartY, e.layerX, e.layerY, e.buttons, e.ctrlKey, e.shiftKey, e.altKey);
                        this.isDrag = true;
                    }
                }
            }
        }

        this.canvas.onmousedown = e => {
            e.preventDefault();
            e.stopPropagation();

            this.isMouseDown = true;
            this.mouseStartX = e.layerX;
            this.mouseStartY = e.layerY;
            this.onmousedown(e.layerX, e.layerY, e.buttons, e.ctrlKey, e.shiftKey, e.altKey);
        }

        this.canvas.onmouseup = e => {
            e.preventDefault();
            e.stopPropagation();

            if (this.isDrag) {
                this.ondragend(this.mouseStartX, this.mouseStartY, e.layerX, e.layerY, e.buttons, e.ctrlKey, e.shiftKey, e.altKey);
                this.isDrag = false;
            }
            this.isMouseDown = false;
            this.onmouseup(e.layerX, e.layerY, e.buttons, e.ctrlKey, e.shiftKey, e.altKey);
        }

        this.canvas.onclick = e => {
            e.preventDefault();
            e.stopPropagation();

            this.onclick(e.layerX, e.layerY, e.ctrlKey, e.shiftKey, e.altKey);
        }

        this.canvas.onkeydown = e => {
            e.preventDefault();
            e.stopPropagation();

            this.onkeydown(e.code, e.ctrlKey, e.shiftKey, e.altKey);
        }

        this.canvas.onkeyup = e => {
            e.preventDefault();
            e.stopPropagation();

            this.onkeyup(e.code, e.ctrlKey, e.shiftKey, e.altKey);
        }

        this.canvas.onkeypress = e => {
            e.preventDefault();
            e.stopPropagation();

            this.onkeypress(e.code, e.ctrlKey, e.shiftKey, e.altKey);
        }

        this.canvas.onwheel = e => {
            e.preventDefault();
            e.stopPropagation();

            this.onwheel(e.layerX, e.layerY, e.deltaY, e.buttons, e.ctrlKey, e.shiftKey, e.altKey);
        }

    }

    start() {
        this.loop = setInterval(() => {
            this.refresh();
            this.ticks += 1;
        }, parseInt(1000 / this.fps));
        this.isStop = false;
    }

    stop() {
        clearInterval(this.loop);
        this.isStop = true;
    }

    refresh() {
        this.clear();
        this.update();
        this.draw();
    }

    clear() {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.ondraw();
    }

    setContextStyle(fillColor='black', strokeColor='black',lineWidth=1,font='normal normal normal 10px sans-serif',textBaseline='alphabetic',textAlign='start',globalAlpha=1,){
        this.ctx.fillStyle = fillColor || 'black';
        this.ctx.strokeStyle = strokeColor || 'black';
        this.ctx.lineWidth = lineWidth || 1;
        this.ctx.font = font || 'normal normal normal 10px sans-serif';
        this.ctx.textBaseline = textBaseline || 'alphabetic';
        this.ctx.textAlign = textAlign || 'start';
        this.ctx.globalAlpha = globalAlpha || 1;
    }

    drawFillText(text, x, y, size=10, color='black',font = 'Arial', baseline='top',textAlign='start') {
        this.setContextStyle(color,null,null,`${size}px ${font}`,baseline,textAlign);
        this.ctx.fillText(text, x, y);
    }

    drawStrokeText(text, x, y, size=10, color='black',font = 'Arial', baseline='top',textAlign='start') {
        this.setContextStyle(null,color,null,`${size}px ${font}`,baseline,textAlign);
        this.ctx.strokeText(text, x, y);
    }

    

    onwheel(x, y, deltaY, buttons, ctrlKey, shiftKey, altKey) { }
    onmousedown(x, y, buttons, ctrlKey, shiftKey, altKey) { }
    onmouseup(x, y, buttons, ctrlKey, shiftKey, altKey) { }
    ondrag(startX, startY, x, y, buttons, ctrlKey, shiftKey, altKey) { }
    ondragend(startX, startY, endX, endY, buttons, ctrlKey, shiftKey, altKey) { }
    onclick(x, y, ctrlKey, shiftKey, altKey) { }
    onmousemove(x, y, buttons, ctrlKey, shiftKey, altKey) { }
    onkeydown(key, ctrlKey, shiftKey, altKey) { }
    onkeyup(key, ctrlKey, shiftKey, altKey) { }
    onkeypress(key, ctrlKey, shiftKey, altKey) { }
    update() { }
    ondraw() { }
    setup() { }
}

class __ItemArray__ {
    constructor(items = []) {
        this.items = items;
    }

    push(item) {
        if (item) return this.items.push(item);
    }

    remove(item) {
        let i = this.items.indexOf(item);
        this.items.splice(i, 1);
    }

    removeIndex(i) {
        this.items.splice(i, 1);
    }

    draw() {
        this.items.forEach(item => {
            item.draw();
        });
    }

}

class __Item__ {
    constructor(game, x, y, width, height, color = 'black', lineWidth = 1) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    isInside(x, y) {
        return (this.x <= x && x < this.x + this.width && this.y <= y && y < this.y + this.height);
    }

    getHitbox() {
        if (this._points_list == undefined) {
            this._points_list = [
                [this.x, this.y],
                [this.x, this.y + this.height],
                [this.x + this.width, this.y],
                [this.x + this.width, this.y + this.height]
            ];
        }

        return this._points_list;
    }

    draw() { }

    onclick() { }
    onmousemove() { }
}

class __Grid__ extends __Item__ {
    constructor(game, x = 0, y = 0, col = 3, row = 3, size = 10, lineWidth = 1, color = 'white', linecolor = 'black') {
        super(game, x, y, col * size, row * size, color, lineWidth);

        this.col = col;
        this.row = row;
        this.size = size;
        this.linecolor = linecolor;
        this.grid = new Array(col).fill(0).map(x => new Array(row).fill(color))
    }

    draw() {
        this.game.ctx.lineWidth = this.lineWidth;
        this.game.ctx.strokeStyle = this.linecolor;
        for (let n = 0; n < this.col; n++) {
            for (let m = 0; m < this.row; m++) {
                this.game.ctx.strokeRect(this.x + n * this.size, this.y + m * this.size, this.size, this.size);
                this.game.ctx.fillStyle = this.grid[n][m];
                this.game.ctx.fillRect(this.lineWidth + (this.x + n * this.size), this.lineWidth + (this.y + m * this.size), this.size - this.lineWidth * 2, this.size - this.lineWidth * 2);
            }
        }
    }

    getBox(x, y) {
        if (this.isInside(x, y)) return { col: parseInt((x - this.x) / (this.size+this.lineWidth)), row: parseInt((y - this.y) / (this.size+this.lineWidth)) };
        else return { col: -1, row: -1 };
    }

    getBoxAxis(col, row) {
        return { x: col * this.size + this.x, y: row * this.size + this.y };
    }

    fillBox(col, row, color = this.color) {
        if (col >= 0 && col < this.col && row >= 0 && row < this.row) {
            this.grid[col][row] = color;
        }
    }

    click() { }
    onclick(e) {
        this.click(this.getBox(e.layerX, e.layerY), { x: e.layerX, y: e.layerY });
    }

}

class __Button__ extends __Item__ {
    constructor(game, x, y, width, height, text, color = 'black', font = '10px Arial', textcolor = 'white', lineWidth = '1',disabled=false) {
        super(game, x, y, width, height, color, lineWidth);

        this.text = text;
        this.font = font;
        this.textcolor = textcolor;
        this.isOver = false;
        this.click = 0;
        this.disabled = disabled;
    }

    strokeDraw() {
        //fillColor,strokeColor,lineWidth,font,textBaseline,textAlign,globalAlpha
        if(this.disabled){
            this.disabledDraw();
        }else{
            this.game.setContextStyle(this.textcolor,this.color,this.lineWidth,this.font,'middle','center');
            this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
            if(this.isOver) this.hoverEffect();
            if(this.game.ticks < this.click) this.clickEffect();
            this.game.ctx.strokeStyle = this.textcolor;
            this.game.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    fillDraw() {
        if(this.disabled){
            this.disabledDraw();
        }else{
            this.game.setContextStyle(this.color,null,this.lineWidth,this.font,'middle','center');
            this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
            if(this.isOver) this.hoverEffect();
            if(this.game.ticks < this.click) this.clickEffect();
            this.game.ctx.fillStyle = this.textcolor;
            this.game.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    hoverEffect(){
        this.game.ctx.fillStyle = 'rgba(255,255,255,.2)';
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    clickEffect(){
        this.game.ctx.fillStyle = 'rgba(255,255,255,.5)';
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    disabledDraw(){
        this.game.setContextStyle('#dddddd',null,this.lineWidth,this.font,'middle','center');
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.game.ctx.fillStyle = '#aaaaaa';
        this.game.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    onmousemove(x,y) {
        if(this.isInside(x,y)) this.isOver = true;
        else this.isOver = false;
    }

    onclick(x,y,callback=()=>{}) {
        if(this.isInside(x,y) && !this.disabled){
            this.click = this.game.ticks+2;
            callback();
        }
    }

}

class __FillText__ extends __Item__ {
    constructor(game, x, y, text = 'OwO', height = 20, color = 'black', font = 'Arial', lineWidth = 1, baseline = 'top', textAlign='start') {
        game.ctx.font = `${height}px ${font}`;
        super(game, x, y, game.ctx.measureText(text).width, height, color, lineWidth);
        this.font = font;
        this.text = text;
        this.baseline = baseline;
        this.textAlign = textAlign;
    }

    setText(text) {
        this.game.ctx.font = `${this.height}px ${this.font}`;
        this.text = text;
        this.width = this.game.ctx.measureText(text).width;
    }

    draw() {
        this.game.setContextStyle(this.color,null,this.lineWidth,`${this.height}px ${this.font}`,this.baseline,this.textAlign);
        this.game.ctx.fillText(this.text, this.x, this.y);
    }
}

class __StrokeText__ extends __FillText__ {
    constructor(game, x, y, text = 'OwO', height = 20, color = 'black', font = 'Arial', lineWidth = 1, baseline = 'top',textAlign = 'start') {
        super(game, x, y, text, height, color, font, lineWidth, baseline);
    }
    draw() {
        this.game.setContextStyle(null,this.color,this.lineWidth,`${this.height}px ${this.font}`,this.baseline,this.textAlign);
        this.game.ctx.strokeText(this.text, this.x, this.y);
    }
}

var TeT = {

    arePoligonsIntersecting(polyA = [], polyB = []) {
        let response = true;
        [polyA, polyB].forEach(polygon => {
            for (let i1 = 0; i1 < polygon.length && response; i1++) {
                let i2 = (i1 + 1) % polygon.length;
                let projection1 = polygon[i1];
                let projection2 = polygon[i2];

                let normal = [projection2[1] - projection1[1],
                projection1[0] - projection2[0]];

                let minA = undefined, maxA = undefined, minB = undefined, maxB = undefined;
                polyA.forEach(poly => {
                    let projected = normal[0] * poly[0] + normal[1] * poly[1];

                    if (minA == undefined || projected < minA) minA = projected;
                    if (maxA == undefined || projected > maxA) maxA = projected;
                });

                polyB.forEach(poly => {
                    let projected = normal[0] * poly[0] + normal[1] * poly[1];

                    if (minB == undefined || projected < minB) minB = projected;
                    if (maxB == undefined || projected > maxB) maxB = projected;
                });

                if (maxA <= minB || maxB <= minA) response = false;
            }
        });
        return response;
    },

    isPointInPoligon(x, y, polygonPoints) {
        let n = polygonPoints.length;
        let inside = false;

        let p1x = polygonPoints[0][0], p1y = polygonPoints[0][1];
        for (let i = 0; i <= n; i++) {
            let p2x = polygonPoints[i % n][0], p2y = polygonPoints[i % n][1];
            if (y > Math.min(p1y, p2y)) {
                if (y <= Math.max(p1y, p2y)) {
                    if (x <= Math.max(p1x, p2x)) {
                        let xints;
                        if (p1y != p2y) xints = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x;
                        if (p1x == p2x || x <= xints) inside = !inside;
                    }
                }
            }
            p1x = p2x;
            p1y = p2y;
        }
        return inside;
    },

    Game:__Game__,
    Item:__Item__,
    ItemArray:__ItemArray__,
    Grid:__Grid__,
    Button:__Button__,
    FillText:__FillText__,
    StrokeText:__StrokeText__,
}