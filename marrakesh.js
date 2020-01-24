function gameStart(data){
    let px = [1,-1, 0, 0];
    let py = [0, 0, 1,-1];

    MyGame = new (class extends TeT.Game{
        constructor(gameinfo){
            super(800,500,50);
            this.gameinfo = gameinfo;
        }
    
        setup(){
            /*this.gameinfo= {
                turno: 3,
                p1: {nombre:'player1',color:'red',dinero:5},
                p2: {nombre:'player2',color:'blue',dinero:9},
                jugando: 'p1',
                pivote: [3,3],
                fase: 1
            }*/

            this.grid = new TeT.Grid(this,10,10,7,7,60,1);
            this.tirarB = new TeT.Button(this,450,130,80,40,'Tirar','#FDE9CB','bold 20px Arial','black',1,true);
            this.pasarB = new TeT.Button(this,540,130,80,40,'Pasar','#FDE9CB','bold 20px Arial','black',1,true);
            
    
            this.dado = {
                numero: '?',
                game:this,
                tiros:0,
                draw(){
                    this.game.setContextStyle('snow','black',1,'40px Arial','middle','center');
                    this.game.ctx.fillRect(500,50,60,60);
                    this.game.ctx.strokeRect(500,50,60,60);
                    this.game.ctx.fillStyle = 'black';
                    this.game.ctx.fillText(this.numero,530,80);
                    
                },
                update(){
                    if(this.tiros){
                        this.numero = Math.floor(Math.random()*4)+1;
                        this.tiros -= 1;
                        if(this.tiros == 0){
                            this.tiro = false;
                            this.numero = this.numeroT;
                        }
                    }
                },
                tirar(num){
                    this.tiros = 20;
                    this.numeroT = num;
                }
            }
    
            this.pivP = (class extends TeT.Item{
                constructor(game,col,row,gridsize,size,color,lineWidth){
                    let {x,y} = game.grid.getBoxAxis(col,row);
                    super(game,x,y,gridsize,gridsize,color,lineWidth);
                    this.size = size;
                    this.gridsize = gridsize;
                }

                draw(){

                    this.game.ctx.lineWidth = this.lineWidth;
                    this.game.ctx.beginPath()
                    this.game.ctx.moveTo(this.x + this.gridsize/2 - this.size, this.y + this.gridsize/2 - this.size);
                    this.game.ctx.lineTo(this.x + this.gridsize/2 + this.size, this.y + this.gridsize/2 + this.size);
                    this.game.ctx.moveTo(this.x + this.gridsize/2 + this.size, this.y + this.gridsize/2 - this.size);
                    this.game.ctx.lineTo(this.x + this.gridsize/2 - this.size, this.y + this.gridsize/2 + this.size);
                    this.game.ctx.closePath();
                    this.game.ctx.strokeStyle = this.color;
                    this.game.ctx.stroke();
                }
            })

            this.piv = new this.pivP(this,3,3,60,10,'rgba(0,0,0,1)',5);
            this.tempPivs = new TeT.ItemArray();
            this.tempPint = [];

        }
    
        draw(){
            this.grid.draw();
            this.drawFillText('Turno de:', 450, 10, 30);
            this.drawFillText(this.gameinfo.nombres[this.gameinfo.jugando], 585, 10, 30,this.gameinfo.colores[this.gameinfo.jugando]);
            this.drawFillText('Dinero', 450, 200,'bold 30',);
            this.drawFillText(this.gameinfo.nombres[0]+': ', 450, 250, 25,this.gameinfo.colores[0]);
            this.drawFillText('$'+this.gameinfo.dineros[0], this.ctx.measureText(this.gameinfo.nombres[0]).width+480, 250, 25);
            this.drawFillText(this.gameinfo.nombres[1]+': ', 450, 300, 25,this.gameinfo.colores[1]);
            this.drawFillText('$'+this.gameinfo.dineros[1], this.ctx.measureText(this.gameinfo.nombres[1]).width+480, 300, 25);
            this.tirarB.fillDraw();
            this.pasarB.fillDraw()
            this.dado.draw();
            this.piv.draw();
            this.tempPivs.draw();
        }
    
        update(){
            this.dado.update();
            this.tirarB.disabled = (this.gameinfo.fase != 0 || this.gameinfo.nombres[this.gameinfo.jugando] != username);
            this.pasarB.disabled = (this.gameinfo.fase != 4 || this.gameinfo.nombres[this.gameinfo.jugando] != username);
        }
    
        onclick(x,y,ctrl,shift,alt){
            if(this.grid.isInside(x,y) && this.gameinfo.nombres[this.gameinfo.jugando] == username){
                //let {col,row} = this.grid.getBox(x,y)
                //this.grid.fillBox(col,row,this.gameinfo.colores[this.gameinfo.jugando]);
            }
    
            this.tirarB.onclick(x,y,()=>{
                this.dado.tiros = -1;
                this.sendData({'tirarDado':true});
            });
            this.pasarB.onclick(x,y,()=>{
                this.sendData({'pasar':true});
            });

            if(this.gameinfo.fase == 2 && this.gameinfo.nombres[this.gameinfo.jugando] == username){
                this.tempPivs.items.forEach(tpiv =>{
                    if(tpiv.isInside(x,y)){
                        let {col,row} = this.grid.getBox(x,y);
                        this.sendData({'pivote':[col,row]});
                    }
                })
            }

            if(this.gameinfo.fase == 4 && this.gameinfo.nombres[this.gameinfo.jugando] == username && this.grid.isInside(x,y)){
                let {col,row} = this.grid.getBox(x,y);
                this.tempPint.forEach(pin=>{
                    if(pin[0] == col && pin[1] == row) this.sendData({'pintado':[col,row]});
                });  
            }
                
        }
    
        onmousemove(x,y,button,ctrl,shift,alt){
            this.tirarB.onmousemove(x,y);
            this.pasarB.onmousemove(x,y);
        }

        sendData(data){
            juegosSocket.send(JSON.stringify({
                'at': 'server',
                'type': 'gameData',
                'gameinfo':this.gameinfo,
                ...data
            }));
        }

        fase2(pivotes){
            if(this.gameinfo.nombres[this.gameinfo.jugando] == username){
                pivotes.forEach(piv =>{
                    this.tempPivs.push(new this.pivP(this,piv[0],piv[1],60,10,'rgba(0,0,0,.5)',5))
                })
            }
        }
        
        fase3(){
            let {x,y} = this.grid.getBoxAxis(this.gameinfo.pivote[0],this.gameinfo.pivote[1]);
            this.piv.x = x;
            this.piv.y = y;
            this.tempPivs.items = [];
        }

        fase4(pintados){
            this.tempPint = pintados;
            pintados.forEach(pin=>{
                this.grid.fillBox(pin[0],pin[1],this.gameinfo.coloresP[this.gameinfo.jugando]);
            });
        }

        pintar(box,callback){
            this.grid.fillBox(box[0],box[1],this.gameinfo.colores[this.gameinfo.jugando]);
            this.grid.fillBox(this.gameinfo.pivote[0],this.gameinfo.pivote[1],this.gameinfo.colores[this.gameinfo.jugando]);
            if(this.gameinfo.nombres[this.gameinfo.jugando] == username){
                for(let a = 0; a < 4; a++){
                    let col = this.gameinfo.pivote[0]+px[a], row = this.gameinfo.pivote[1]+py[a];
                    if(col == box[0] && row == box[1]) continue;
                    this.grid.fillBox(col,row);
                }
            }
            callback();
        }

        endGame(ganador){
            this.draw = ()=>{
                this.drawFillText('Ha Ganado:', 100, 100, 50);
                this.drawFillText(ganador[0], 380, 100, 'bold 50',ganador[1]);
                this.drawStrokeText('Ha Ganado:', 100, 100, 50,'white');
                this.drawStrokeText(ganador[0], 380, 100, 'bold 50','white');
            }
        }
    
    })(data['data']);
    MyGame.canvas.id = 'gameCanvas';
    document.getElementById('room').hidden = true;
    if(document.getElementById('gameCanvas')) document.getElementById('gameCanvas').replaceWith(MyGame.canvas)
    else document.getElementById('gameplay').appendChild(MyGame.canvas);
    MyGame.setup();
    MyGame.start();
}

function gameData(data) {
    //console.log(data);
    if(data['gameinfo']){
        MyGame.gameinfo = data['gameinfo'];
        MyGame.gameinfo.jugando += 0;
        switch (MyGame.gameinfo.fase){
            case 0:
                if(data['grafo']) MyGame.grid.grid = data['grafo'];
                break;
            case 1:
                if(data['dado']) MyGame.dado.tirar(data['dado']);
                break;
            case 2:
                if(data['pPivotes']) MyGame.fase2(data['pPivotes']);
                break;
            case 3:
                MyGame.fase3();
                break;
            case 4:
                if(data['pPintados']) MyGame.fase4(data['pPintados']);
                break;
        }
    }else if(data['ganador']){
        MyGame.endGame(data['ganador']);
    }

}

roomView = (data)=>{
    //console.log(data);
    if(document.getElementById('playerList')) document.getElementById('playerList').remove();
    let roomd = document.createElement('div');
    roomd.id = 'playerList';
    let playerd = document.createElement('div');
    playerd.innerHTML = '<div class="playeritem white"><p>Nickname</p><p>Ready</p></div>';
    roomd.appendChild(playerd);

    data.forEach((player,index)=>{
        playerd = document.createElement('div');
        playerd.className = 'playeritem'
        if(index%2 == 0) playerd.className += ' grey lighten-3';
        else playerd.className += ' white';
        let tem = document.createElement('p');
        tem.innerText = player[0];
        playerd.appendChild(tem);
        tem = document.createElement('input');
        tem.type = 'checkbox';
        tem.checked = player[1];
        tem.onchange = ()=>{
            ready4play(tem.checked);
        }
        if(player[0] != username) tem.disabled = true;
        playerd.appendChild(tem);
        roomd.appendChild(playerd);
    });
    document.getElementById('room').appendChild(roomd);
}