var nome=localStorage.getItem("nome");
var nome2=localStorage.getItem("nome2");

const canvas=document.getElementById("pingpong");
//ci permette di usare i metodi del canvas
const context=canvas.getContext("2d");
var dbonus = true;//dove cade il bonus - true->destra
var ybonus = Math.floor(Math.random() * 760)+20;//dove si crea il bonus
var tempo = -1;
var attivo = Math.floor(Math.random() * 2);
var bonus_src=["immagini/ponti.png","immagini/angi.png"/*,"immagini/babi.png"*/];
var immagine_bonus= new Image();
immagine_bonus.src=bonus_src[Math.floor(Math.random() * 2)];


const AnimationType = {
  NONE: 0,
  LINEAR: 1,
  KEYBOARD_RIGHT: 2,
  KEYBOARD_LEFT: 3,
};

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

function disegnatestopiccolo(testo,x,y,colore){
	context.fillStyle=colore;
	context.font="35px fantasy";
	context.fillText(testo,x,y);
}

//barra utente

const user = {
	x : 0,
	y : canvas.height/2 - 200/2,
	width : 50,
	height : 200,
	colore : "WHITE",
	animationType : AnimationType.KEYBOARD_RIGHT,
	score : 0
	
}

var player = user;
//barra computer
const pc = {
	x : canvas.width-50,
	y : canvas.height/2- 200/2,
	width : 50,
	height : 200,
	colore : "WHITE",
	animationType : AnimationType.KEYBOARD_LEFT,
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

const multipalla = {
	x : canvas.width/2,
	y : canvas.height/2,
	raggio : 25,
	colore : "GREY",
	vel : 5,
	velx : 5,//vel + direzione
	vely : 5,//vel + direzione
	visibility:"hidden"
}

const pallabonus = {
	x : canvas.width/2,
	y : ybonus,
	raggio : 15,
	colore : "GREY",
	vel : 5,
	style : "hidden"
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
//palla.x = canvas.width/2;
	
function render(){
	//pulire il canvas
	disegnarettangolo(0,0,canvas.width,canvas.height,"BLACK");
	//disegnare i due punteggi
	disegnatesto(user.score, canvas.width/4,canvas.height/5,"WHITE");
	disegnatesto(nome, canvas.width/4,canvas.height/10,"WHITE");
	disegnatesto(nome2, canvas.width/1.5,canvas.height/10,"WHITE");
	disegnatesto(pc.score, canvas.width*3/4,canvas.height/5,"WHITE");
	//disegna la rete
	disegnarete();
	//disegna le due barre
	disegnarettangolo(user.x,user.y,user.width,user.height,user.colore);
	disegnarettangolo(pc.x,pc.y,pc.width,pc.height,pc.colore);
	//disegna la palla
	disegnacerchio(palla.x, palla.y, palla.raggio, palla.colore);
	if(multipalla.visibility=="visible"){
		//disegnacerchio(multipalla.x, multipalla.y, multipalla.raggio, multipalla.colore);
		context.drawImage(immagine_bonus,multipalla.x-125,multipalla.y-125);
	}
}	

function game(){
	render();
	movimento();
	updatePosition();
}	

//loop
const frameAlSecondo = 50;
setInterval(game, 1000/frameAlSecondo);		//richiama game() 50 volte al secondo->50fps
setInterval(timer, 1000);
setInterval(bonus, 1000/frameAlSecondo);	

function movimento(){
	palla.x +=palla.velx;
	palla.y +=palla.vely;
	//controllo il movimento della barra del pc	
	//controllo collisione y;
	if(palla.y + palla.raggio > canvas.height || palla.y - palla.raggio < 0){
		palla.vely = -palla.vely; 
	}
	if(multipalla.y + 90 > canvas.height || multipalla.y - 90 < 0){
		multipalla.vely = -multipalla.vely; 
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

	//MULTIPALLA
	if(multipalla.visibility=="visible"){
		multipalla.x +=multipalla.velx;
		multipalla.y +=multipalla.vely;
		
		var multiplayer = (multipalla.x < canvas.width/2)? user:pc;		//se true player=user else player=pc;
		//se la palla colpisce una delle due barre
		if(collisione(multipalla,multiplayer)){
		
		var multipuntoCollisione = (multipalla.y - (multiplayer.y + multiplayer.height/2));		//calcolo del punto di collisione, se è 0 la palla ha colpito il centro della barra, se -1 l'angolo alto, se 1 l'angolo basso
		multipuntoCollisione = multipuntoCollisione/(multiplayer.height/2);		//per avere range da -1 a 1
		//calcolo angolo in radianti
		var multiangolo = multipuntoCollisione * (Math.PI/4);		//se colpisce gli angoli della barra la palla deve avere un angolo di +-45 gradi
		var multidirezione = (multipalla.x < canvas.width/2) ? 1 : -1;		//per cambiare direzione della palla in base a quale barra colpisce
		//cambio velociyà e direzione in base al punto della barra colpito
		multipalla.velx = multidirezione*	multipalla.vel * Math.cos(multiangolo);
		multipalla.vely = multidirezione*	multipalla.vel * Math.sin(multiangolo);
		
		multipalla.vel += 1;		//per incrementare la difficoltà
		}
		//se viene fatto punto
		if(multipalla.x - multipalla.raggio < 0){

			pc.score=pc.score+5;	
			console.log(immagine_bonus.src);
			if(immagine_bonus.src.substr(immagine_bonus.src.length-8,8)=="angi.png")
			{
				angisound();
			}
			else
			{
				
				pontisound();
			}
			multipalla.visibility="hidden";
			resetMultiPalla();
			
		}else if(multipalla.x + multipalla.raggio > canvas.width){
			console.log(immagine_bonus.src);
			user.score=user.score+5;
			if(immagine_bonus.src.substr(immagine_bonus.src.length-8,8)=="angi.png")
			{
				angisound();
			}
			else
			{
				
				pontisound();
			}
			multipalla.visibility="hidden";
			resetMultiPalla();
			
		}
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
	palla.velx = -palla.velx;//la palla va nel verso chi ha subito
}	

function resetMultiPalla(){
	multipalla.x = canvas.width/2;
	multipalla.y = canvas.height/2;
	multipalla.vel = 5;
	multipalla.velx=5;
	multipalla.vely=5;
	multipalla.velx = -multipalla.velx;//la palla va nel verso di chi ha subito goal
}

//controllo la barra utente 

/* gestione eventi da tastiera */
// creo un oggetto che mantiene traccia dei tasti premuti
// e gestisco due set di tasti
// keyboardRight:  W (alto), D (destra), S (basso), A (sinistra)
// keyboardLeft: tasti cursore
function UserInput() {
  this.keyboardRight = {
    up: false,
    right: false,
    down: false,
    left: false
  };
  this.keyboardLeft = {
    up: false,
    right: false,
    down: false,
    left: false
  };
}
//creo l'oggetto
const userInput = new UserInput();

const handleKeys = function (event) {
  //in base al tipo di evento verifico se il tasto è ancora premuto o meno
  const ok = event.type === 'keydown';
  switch (event.keyCode) {
    // FRECCETTE
    case 38:
      userInput.keyboardLeft.up = ok;
      event.preventDefault();
      break;
    case 39:
      userInput.keyboardLeft.right = ok;
      event.preventDefault();
      break;
    case 40:
      userInput.keyboardLeft.down = ok;
      event.preventDefault();
      break;
    case 37:
      userInput.keyboardLeft.left = ok;
      event.preventDefault();
      break;
 
    // W D S A
    case 87:
      userInput.keyboardRight.up = ok;
      event.preventDefault();
      break;
    case 68:
      userInput.keyboardRight.right = ok;
      event.preventDefault();
      break;
    case 83:
      userInput.keyboardRight.down = ok;
      event.preventDefault();
      break;
    case 65:
      userInput.keyboardRight.left = ok;
      event.preventDefault();
      break;
  }
  //console.log(event.keyCode);
};
 
//aggancio gli eventi di tastiera 
document.addEventListener('keydown', handleKeys);
document.addEventListener('keyup', handleKeys);

function updatePosition() {
    //gestisco lo spostamento da tastiera tramite i tasti cursore
    if (user.animationType == AnimationType.KEYBOARD_LEFT || user.animationType == AnimationType.KEYBOARD_RIGHT) {
      const keyBoard = user.animationType === AnimationType.KEYBOARD_LEFT ? userInput.keyboardLeft : userInput.keyboardRight;
      if (keyBoard.up)
		  if(user.y>=0)
		  {
			user.y -= 10;
		  }//Math.abs(user.vely);
      if (keyBoard.down)
		  if(user.y<=canvas.height-user.height)
		  {
			user.y += 10;//Math.abs(user.vely);
		  };
    };
	
	    if (pc.animationType == AnimationType.KEYBOARD_LEFT || pc.animationType == AnimationType.KEYBOARD_RIGHT) {
      const keyBoard = pc.animationType === AnimationType.KEYBOARD_LEFT ? userInput.keyboardLeft : userInput.keyboardRight;
      if (keyBoard.up)
		  if(pc.y>=0)	  
			pc.y -= 10;//Math.abs(pc.vely);
      if (keyBoard.down)
		  if(pc.y<=canvas.height-pc.height)
        pc.y += 10;//Math.abs(pc.vely);
      
    };

}

function bonus(){
	if(pallabonus.style=="visible"){

	disegnacerchio(pallabonus.x, pallabonus.y, pallabonus.raggio, pallabonus.colore);
	
	if(dbonus)
	{pallabonus.x+=pallabonus.vel;}
	else
	{pallabonus.x-=pallabonus.vel;}

	

    player = (pallabonus.x < canvas.width/2)? user:pc;
	
	if(collisione(pallabonus,player)){
		pallabonus.x = canvas.width/2;
		pallabonus.style = "hidden";

		switch(attivo){
			case 0: grande();					
					break;
					
			case 1:	piccolo();
					break;
			
			case 2: immagine_bonus.src=bonus_src[Math.floor(Math.random() * 2)];
					console.log(immagine_bonus.src);
					multipalla.visibility="visible";
					break;

		}
		
	};
	//se la pallina non viene presa
	if(pallabonus.x+pallabonus.raggio>canvas.width||pallabonus.x-pallabonus.raggio<0)
	{
		pallabonus.x = canvas.width/2;
		pallabonus.style="hidden";
	};
	
	}
	
	
	//dbonus=!dbonus;
	//pallabonus.y = Math.floor(Math.random() * 760)+20;
}

function timer(){
	tempo+=1;
	console.log(tempo);
		
	if(tempo%5==0&&tempo!=0)
	{
		pallabonus.y = Math.floor(Math.random() * 760)+20;
		pallabonus.style="visible";
		dbonus=!dbonus;
		attivo = Math.floor(Math.random() * 3);
		
		//resetMultiPalla();
	}
}

function grande(){
	if(player.height<canvas.height-50)
	{player.height+=50;}
	
}

function piccolo(){
	if(player.height>50)
	{player.height-=50;}
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

function angisound() {
    var asnd = new Audio("suoni/noneperme.mp3");
	//asnd.volume=0.5;
    asnd.play();
}

function pontisound() {
    var psnd = new Audio("suoni/vaiapisciareilcane.mp3");
	//asnd.volume=0.5;
    psnd.play();
}