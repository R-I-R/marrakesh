const movx = [1,-1, 0, 0];
const movy = [0, 0, 1,-1];

let newgameHTML = document.getElementById('newgame');
let tableroHTML = document.getElementById("tablero");
let dado = document.getElementById("dadoT");
let turnoHTML = document.getElementById("turno");
let turno = 0;
let tablero = [];
let pivote = [3,3];
let players = [document.getElementById("p1M"),document.getElementById("p2M")];
let size = 7;
let nturno = 0;
let Pcolores = ['Pred','Pblue'];
let Colores = ['red','blue'];

function addClass(elemento,clase){
    elemento.className = elemento.className + ' ' + clase;
}

function deleteClass(elemento,clase){
    elemento.className = elemento.className.replace(clase,'');
}

function random(ini,fin){
    return (Math.floor(Math.random()*fin)+ini);
}

function changeTurno(){
    turno = (turno+1)%2;
    turnoHTML.innerText = turno+1;
    turnoHTML.className = 'T'+Colores[turno];
    document.getElementById('dadoB').disabled = false;
    document.getElementById("pasar").disabled = true;
}

function jugar(){
    newgameHTML.className = 'oculto';
    document.getElementById('victoria').className = 'oculto';
    document.getElementById('juego').className = '';
    tableroHTML.innerHTML = '';

    tablero = [];
    pivote = [3,3];
    nturno = 0;
    dado.innerText = '';

    for(a = 0; a < size; a++){
        let tem = [];
        let temHTML = document.createElement('div')
        temHTML.className = 'fila';

        for(b = 0; b < size; b++){
            let ete = document.createElement('div');
            ete.className = 'casilla';
            ete.innerText = '*';
            ete.marca = -1;
            temHTML.appendChild(ete);
            tem.push(ete);
        }
        tablero.push(tem);
        tableroHTML.appendChild(temHTML);
    }

    addClass(tablero[3][3],'pivote');
    players[0].innerText = 16;
    players[1].innerText = 16;

    
    turno = random(1,2)-1;
    changeTurno();

}


function tirarDado(){
    document.getElementById('dadoB').disabled = true;
    let nr = nturno? random(1,4): random(1,3);
    nturno++;

    dado.innerText = nr;
    let pPivotes = [];

    for(let a = 0; a < 4; a++){
        let x = pivote[0]+movx[a]*nr;
        let y = pivote[1]+movy[a]*nr;

        if(x >= 7 || x < 0 || y >= 7 || y < 0) continue;

        addClass(tablero[x][y],'Ppivote');
        pPivotes.push(tablero[x][y]);
        tablero[x][y].onclick = ()=>mover(pPivotes,[x,y]);
    }

    if(pPivotes.length == 0) changeTurno();

}

let Ppintados = [];

function mover(pPivotes,piv){
    //console.log(pPivotes,piv);
    deleteClass(tablero[pivote[0]][pivote[1]],'pivote');
    pivote = [...piv];
    addClass(tablero[pivote[0]][pivote[1]],'pivote');

    for(a = 0; a < pPivotes.length; a++){
        //console.log("borrando",a);
        deleteClass(pPivotes[a],'Ppivote');
        pPivotes[a].onclick = '';
    }

    if(tablero[pivote[0]][pivote[1]].marca == turno){
        changeTurno();
        return;
    }else if(tablero[pivote[0]][pivote[1]].marca != -1){

        let grafo = [];
        for(a = 0; a < size; a++){
            let tem = [];
            for(b = 0; b < size; b++){
                tem.push(false);
            }
            grafo.push(tem);
        }

        let bloques = DFS(grafo,pivote[0],pivote[1],(turno?0:1))/2;

        players[turno].innerText -= bloques;
        players[(turno?0:1)].innerText += bloques;
        if(players[turno].innerText <= 0) endGame();
        else changeTurno();
        return;
    }

    document.getElementById('pasar').disabled = false;

    Ppintados = [];

    for(let a = 0; a < 4; a++){
        let x = pivote[0]+movx[a];
        let y = pivote[1]+movy[a];

        if(x >= 7 || x < 0 || y >= 7 || y < 0) continue;
        if(tablero[x][y].marca != -1) continue;

        addClass(tablero[x][y],Pcolores[turno]);
        Ppintados.push(tablero[x][y]);
        tablero[x][y].onclick = ()=>pintar(x,y);
    }

    if(Ppintados.length == 0) changeTurno();
}

function pasar(){
    document.getElementById("pasar").disabled = true;
    for(a = 0; a < Ppintados.length; a++){
        //console.log("borrando",a);
        deleteClass(Ppintados[a],Pcolores[turno]);
        Ppintados[a].onclick = '';
    }
    changeTurno();
}

function pintar(x,y){
    //console.log(pPivotes,piv);

    addClass(tablero[pivote[0]][pivote[1]],Colores[turno]);
    addClass(tablero[x][y],Colores[turno]);
    tablero[pivote[0]][pivote[1]].marca = turno;
    tablero[x][y].marca = turno;

    players[turno].innerText--;

    for(a = 0; a < Ppintados.length; a++){
        //console.log("borrando",a);
        deleteClass(Ppintados[a],Pcolores[turno]);
        Ppintados[a].onclick = '';
    }

    if(players[turno].innerText <= 0) endGame();
    else changeTurno();
}

function DFS(grafo,x,y,k){
    if(x >= 7 || x < 0 || y >= 7 || y < 0) return 0;
    //addClass(tablero[x][y],'black');
    if(tablero[x][y].marca != k) return 0;
    if(grafo[x][y]) return 0;

    let cont = 1;
    grafo[x][y] = true;
    //console.log(grafo);

    //addClass(tablero[x][y],'T'+Colores[turno]);

    for(let a = 0; a < 4; a++){
        //console.log(a);
        let tx = x+movx[a];
        let ty = y+movy[a];

        //if(grafo[tx][ty]) continue;
        cont += DFS(grafo,tx,ty,k);
    }

    return cont;
}

function endGame(){
    changeTurno();
    document.getElementById('juego').className = 'oculto';
    newgameHTML.className = '';
    document.getElementById('victoria').className = 'T'+Colores[turno];
    document.getElementById('victoria').innerText = `Ha ganado el jugador ${turno+1}`;
}
