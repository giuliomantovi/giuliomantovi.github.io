const canvas=document.getElementById("pingpong");
var dif=localStorage.getItem("difficolta");
var pcLevel=0.1;
if(dif==1)	 pcLevel = 0.05;
if(dif==2)	 pcLevel = 0.08;
if(dif==3)	 pcLevel = 0.15;
if(dif==4)	 pcLevel = 0.2;
var nome=localStorage.getItem("nome");
//ci permette di usare i metodi del canvas
const context=canvas.getContext("2d");

function disegnarettangolo(x,y,w,h,colore){
	context.fillStyle=colore;
	context.fillRect(x,y,w,h);
}

function disegnacerchio(x,y,r,colore){
	context.fillStyle=colore;
	context.beginPath();
	context.arc(x,y,r,0,Math.PI*2,false);
	context.closePath();
	context.fill();
}

function disegnatesto(testo,x,y,colore){
	context.fillStyle=colore;
	context.font="75px fantasy";
	context.fillText(testo,x,y);
}

//barra utente
const user = {
	x : 0,
	y : canvas.height/2 - 200/2,
	width : 50,
	height : 200,
	colore : "WHITE",
	score : 0
}

//barra computer
const pc = {
	x : canvas.width-50,
	y : canvas.height/2- 200/2,
	width : 50,
	height : 200,
	colore : "WHITE",
	score : 0
}
//palla
const palla = {
	x : canvas.width/2,
	y : canvas.height/2,
	raggio : 25,
	colore : "WHITE",
	vel : 5,
	velx : 5,//vel + direzione
	vely : 5,//vel + direzione
}	


//rete
const rete = {
	x : canvas.width/2-4/2,
	y : 0,
	width : 4,
	height : 20,
	colore : "WHITE",
}	

function disegnarete(){
	for(var i=0;i<=canvas.height;i+=45){
		disegnarettangolo(rete.x, rete.y+i, rete.width,rete.height,rete.colore);

	}	
}


function render(){
	//pulire il canvas
	disegnarettangolo(0,0,canvas.width,canvas.height,"BLACK");
	//disegnare i due punteggi
	disegnatesto(user.score, canvas.width/4,canvas.height/5,"WHITE");
	disegnatesto(pc.score, canvas.width*3/4,canvas.height/5,"WHITE");
	disegnatesto(nome, canvas.width/4,canvas.height/10,"WHITE");
	disegnatesto("CPU", canvas.width/1.5,canvas.height/10,"WHITE");
	//disegna la rete
	disegnarete();
	//disegna le due barre
	disegnarettangolo(user.x,user.y,user.width,user.height,user.colore);
	disegnarettangolo(pc.x,pc.y,pc.width,pc.height,pc.colore);
	//disegna la palla
	disegnacerchio(palla.x, palla.y, palla.raggio, palla.colore);
}	

function game(){
	render();
	movimento();
}	

//loop
const frameAlSecondo = 50;
setInterval(game, 1000/frameAlSecondo);		//richiama game() 50 volte al secondo->50fps

function movimento(){
	palla.x +=palla.velx;
	palla.y +=palla.vely;
	//controllo il movimento della barra del pc
	pc.y += (palla.y - (pc.y + pc.height/2))*pcLevel;//la barra del computer segue la palla con un delay, con il tempo si potrà battere
	
	//controllo collisione y;
	if(palla.y + palla.raggio >= canvas.height || palla.y - palla.raggio <= 0){
		palla.vely = -palla.vely; 
	}
	var player = (palla.x < canvas.width/2)? user:pc;		//se true player=user else player=pc;
	//se la palla colpisce una delle due barre
	if(collisione(palla,player)){

	var puntoCollisione = (palla.y - (player.y + player.height/2));		//calcolo del punto di collisione, se è 0 la palla ha colpito il centro della barra, se -1 l'angolo alto, se 1 l'angolo basso
	puntoCollisione = puntoCollisione/(player.height/2);		//per avere range da -1 a 1
	//calcolo angolo in radianti
	var angolo = puntoCollisione * (Math.PI/4);		//se colpisce gli angoli della barra la palla deve avere un angolo di +-45 gradi
	var direzione = (palla.x < canvas.width/2) ? 1 : -1;		//per cambiare direzione della palla in base a quale barra colpisce
	//cambio velociyà e direzione in base al punto della barra colpito
	palla.velx = direzione*	palla.vel * Math.cos(angolo);
	palla.vely = direzione*	palla.vel * Math.sin(angolo);
	
	palla.vel += 1;		//per incrementare la difficoltà
	
	if(player==user){
		highsound();
	}
	else{
		lowsound();
	}

	}
	//se viene fatto punto
	if(palla.x - palla.raggio < 0){
		pc.score++;	
		losesound();
		resetPalla();
	}else if(palla.x + palla.raggio > canvas.width){
		user.score++;
		winsound();
		resetPalla();
	}		
	
}

function collisione(b,p){//b=palla, p= player
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x +p.width;
	
	b.top = b.y - b.raggio;
	b.bottom = b.y + b.raggio;
	b.left = b.x - b.raggio;
	b.right = b.x + b.raggio;
	
	return b.right>p.left&&b.bottom>p.top&&b.left<p.right&&b.top<p.bottom;//se questo è vero, c'è collisione

}	


function resetPalla(){
	palla.x = canvas.width/2;
	palla.y = canvas.height/2;
	palla.vel = 5;
	palla.velx=5;
	palla.vely=5;
	palla.velx = -palla.velx;//la palla va nel verso di chi ha subito goal
}	

//controllo la barra utente 
canvas.addEventListener("mousemove",movePaddle);

function movePaddle(evt){

	var rect = canvas.getBoundingClientRect();//per aggiustare la barra nel caso si scrolli la pagina
	user.y =evt.clientY - rect.top - user.height/2; //la y/2 della barra dell'utente è la y del mouse
}	

function highsound() {
    var hsnd = new Audio("suoni/lowwoodhit.wav");
	
    hsnd.play();
}

function lowsound() {
    var lsnd = new Audio("suoni/woodhit.wav");
	
    lsnd.play();
}

function winsound() {
    var wsnd = new Audio("suoni/highbeep.wav");
	wsnd.volume=0.5;
    wsnd.play();
}

function losesound() {
    var fsnd = new Audio("suoni/lowbeep.wav");
	fsnd.volume=0.5;
    fsnd.play();
}