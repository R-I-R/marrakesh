var canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

function drawGrid(x,y,row,col,size,width,color){
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    for(let n = 0; n < col; n++)
        for(let m = 0; m < row; m++)
            ctx.strokeRect(x+n*size,y+m*size,size,size);
}

function drawPiv(x,y,size,width,color){
    ctx.lineWidth = width;
    ctx.beginPath()
    ctx.moveTo(x-size,y-size);
    ctx.lineTo(x+size,y+size);
    ctx.moveTo(x+size,y-size);
    ctx.lineTo(x-size,x+size);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawInfo(text, x, y, size, baseline, color, font='Arial'){
    ctx.font = `${size}px ${font}`;
    ctx.textBaseline = baseline;
    ctx.fillStyle = color;
    ctx.fillText(text,x,y);
}

drawPiv(15,15,10,3,'rgba(0,0,255,1)');
drawGrid(1,1,7,7,30,1,'black');

drawInfo('Turno de:', 250, 10, 20, 'top', 'black');
drawInfo('RIR', 340, 10, 20, 'top', 'red');


ctx.fillStyle = 'rgba(255,0,0,.5)';

canvas.onclick = (e) =>{
    let n = parseInt((e.layerX-1)/30);
    let m = parseInt((e.layerY-1)/30);

    ctx.fillRect(2+n*30,2+m*30,28,28);
    console.log(parseInt((e.layerX-1)/30));
}

function draw(){
    var x = 0;
    var y = 0;
   canvas.onmousemove = (e) =>{
       x = e.layerX;
       y = e.layerY;
   }

   var i = setInterval(()=>{
       ctx.clearRect(0,0,canvas.offsetWidth,canvas.height);
       ctx.strokeRect(x, y, 20, 20);
   }, 20);
}
