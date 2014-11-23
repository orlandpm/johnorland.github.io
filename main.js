window.onload = function (){

var move = [false,false,false,false];
////console.log(move);

function Player (){
	//console.log("newplayer....");
	this.type = "player";
	this.rot = 0;
	this.pos = [300,300];
	this.dir = [0,-1];
	this.speed = .2;
	this.rotSpeed = .005;
	this.move = [false, false, false, false];
	this.shooting = 0;
	this.shot = 0;
	this.walk = 0;
    this.step = [false,false];
    this.health = 100;
    this.attacks = [];
    this.ranged = [];
    this.shotId;
}

function Enemy (){
	//console.log("newplayer....");
	this.type = "enemy";
	this.id = 0;

	this.rot = 0;
	this.pos = [0,0];
	this.size = [50,50];
	this.dir = [1,0];
	this.speed = .05;
	this.rotSpeed = .0001;
	this.moving = false;
	this.walk = 0;
	this.health = 100;
	this.corpse = false;
	this.corpseTime = 0;
	this.init = function () {
		var temp = [0,500];
		temp = rotateVector(temp, Math.PI * 2 * Math.random());
		this.pos[0] = 300 + temp[0];
		this.pos[1] = 300 + temp[1];
		//console.log(this.pos);
	}
}

function Resource(){
	this.type;
	this.name;
	this.path;
	this.num;
	this.init = function(type, name, path, num){
		this.type = type;
		this.name = name;
		this.path = path;
		this.num = num;
	}
}

function Attack(){
	this.damage = 0;
	this.pos = [0,0];
	this.dir = [0,0];
	this.rot = 0;
	this.origin = null;
	this.speed = 20;
	this.type = "";
	this.collided = false;
	this.traveled = 0;
}

var keyHandler = function (game, key, val) {
	
  var player = game.player;
  if(key == 37) { // left
     //console.log("left");
     player.move[0] = val;
  }
  if(key == 38) { // left
     //console.log("up");
     player.move[1] = val;
  }
  if(key == 39) { // left
     //console.log("right");
     player.move[2] = val;
  }
  if(key == 40) { // left
     //console.log("down");
     player.move[3] = val;
  }
  if(key == 65) {	
  	 if(val == true){
  	 	player.shot = true;
  	 }
  	 else if(val == false){
  	 	player.shot = false;
  	 	clearInterval(player.shotId);
  	 	player.shotId = null;
  	 }
}
  return player;
}

var playerMoveHandler = function(player, elts, diff) {
    ////console.log(diff);
	if(player.move[0]){
		player.rot -= diff*player.rotSpeed;
		player = rotate(player);
		
	}
	else if(player.move[2]){
		player.rot += diff*player.rotSpeed;
		player = rotate(player);
		
	}
	if(player.move[1]){
		player.pos[0] += player.dir[0] * player.speed * diff;
		player.pos[1] += player.dir[1] * player.speed * diff;
		player.walk += diff;
	}
	else if(player.move[3]){
		player.pos[0] -= player.dir[0] * player.speed * diff;
		player.pos[1] -= player.dir[1] * player.speed * diff;
		player.walk += diff;
	}
	if(player.walk >= 800){
		player.walk = Math.floor(player.walk%800);
	}

	if(player.shot && player.shotId == null){
		//console.log(player.shot);
		playerShot(game, player);
		player.shotId = setInterval(function(){
			playerShot(game, player);	
	},100);
	}
	if(player.shooting>0){
		player.shooting -= diff;
	}
	else{
		player.shooting = 0
		
	};
   // //console.log(player.dir); 
	return player;
}

var playerShot = function(game, player){
	var err;
				var a = new Attack();
				var temp = rotateVector([5,30], player.rot);
	  	 			a.pos = player.pos.slice(0);
	  	 			
	  	 			if(player.move[1] || player.move[3]){
	  	 				err = .5;
	  	 			}
	  	 			else{
	  	 				err = .1;
	  	 			}
	  	 			a.rot = player.rot - err + Math.random()*2*err;
	  	 			a.dir = getUnitVector(a.rot);
	  	 		
	  	 			a.pos[0] += 25 + temp[0];
	  	 			a.pos[1] += 25 - temp[1];

	  	 			a.damage = 60;

	  	 			a.origin = "player";
	  				a.type = "ranged";
					game.attacks.push(a)

				player.shot++;
				player.shooting+=50;	
			
}
var drawMuzzleFlash = function(player){

	//console.log("LOOOOL");
	var canvas = document.getElementById('canvas2');
	var ctx = canvas.getContext("2d");
	
}
var playerDrawHandler = function(game, canvas, player){
	var ctx = canvas.getContext("2d");
	var img_player = game.images.player
	//console.log(player.dir);
	ctx.save();
	ctx.translate(player.pos[0] + 25, player.pos[1] + 25)
	ctx.rotate(player.rot);
	ctx.translate(-(player.pos[0]+ 25), -(player.pos[1] + 25));
	//console.log(player.move);
	var frame = Math.floor(player.walk/100);
	if(frame > 7){
		alert("rofl youre stupid");
			}
	if(player.move[1] == true || player.move[3] == true){
		////console.log("what");
		ctx.drawImage(img_player, frame*50, 0, 50, 50, player.pos[0], player.pos[1], 50, 50);
	}
	
	else{
		ctx.drawImage(img_player, 0, 0, 50, 50, player.pos[0], player.pos[1], 50, 50);
		player.walk = 0;
		frame = 0;
	}
	if(frame == 1 && player.step[0] == false){
			var footstep = game.sounds.concrete1.play();
			//footstep.volume = .3;
			player.step[0] = true;
	}
	else if(frame == 5 && player.step[1] == false){
			var footstep = game.sounds.concrete2.play();
			//footstep.volume = .3;
			player.step[1] = true;
	}
	else if(frame == 0){
		player.step = [false,false];
	}
		ctx.restore();

	if(player.shooting){
        var img_muzzle = game.images.muzzle;
		var ctx = canvas.getContext("2d");
		ctx.save();
		ctx.translate(player.pos[0] + 25, player.pos[1] + 25)
		ctx.rotate(player.rot);
		ctx.translate(-(player.pos[0] + 25), -(player.pos[1] + 25));
		ctx.drawImage(img_muzzle, 0, 0, 50, 50, player.pos[0]+ 23, player.pos[1] -22, 50, 50);
		ctx.restore();
		//console.log(player.rot);
	}
}

var enemyMoveHandler = function (enemy, player, diff){
	console.log("moving an enemy");
    var temp = [0,0];
    var v = [0,0];
    temp[0] = player.pos[0] - enemy.pos[0];
    temp[1] = player.pos[1] - enemy.pos[1];
    var mag = (Math.sqrt(Math.pow(temp[0], 2) + Math.pow(temp[1], 2)))
    if(mag < 15){
    	player.health -= 5;
    	if(player.health > 0){
    		game.sounds.impact.play();
        }
    	enemy.rot = Math.PI/2 + Math.atan2(enemy.dir[1], enemy.dir[0]) + Math.random() * .2;
    	return enemy;
    }
    v[0] = temp[0]/mag;
	v[1] = temp[1]/mag;
    enemy.dir[0] = v[0];
    enemy.dir[1] = v[1];
   //onsole.log(diff);
    enemy.pos[0] = enemy.pos[0] + enemy.dir[0] * enemy.speed * diff;
    enemy.pos[1] = enemy.pos[1] + enemy.dir[1] * enemy.speed * diff;
    enemy.rot = Math.PI/2 + Math.atan2(enemy.dir[1], enemy.dir[0]) + Math.random() * .2;
 	enemy.walk += diff;
 	if(enemy.walk > 700){
 		enemy.walk = Math.floor(enemy.walk%700);
 	}
    return enemy;
}

var enemyDrawHandler = function (game, canvas, enemy){
    var ctx = canvas.getContext("2d");
	var img_enemy = game.images.enemy;

	ctx.save();
	ctx.translate(enemy.pos[0] + 25, enemy.pos[1] + 25)
	ctx.rotate(enemy.rot);
	ctx.translate(-(enemy.pos[0] + 25), -(enemy.pos[1] + 25));
	

	var frame = Math.floor(enemy.walk/100);
	ctx.drawImage(img_enemy, frame*50, 0, 50, 50, enemy.pos[0], enemy.pos[1], 50, 50);
	ctx.restore();
}

var rotate = function (player) {
	var temp = [-Math.sin(player.rot),Math.cos(player.rot)];
	player.dir[0] = -temp[0];
	player.dir[1] = -temp[1];
	return player;
}

var getUnitVector = function(angle){
	var temp = [Math.sin(angle), -Math.cos(angle)];
	return temp;
}

var rotateVector = function (vector, angle) {
	var temp = [-Math.sin(angle),Math.cos(angle)];
	//console.log(temp);
	var ret = [vector[0] * temp[1] - vector[1] * temp[0] , vector[0] *temp[0] + vector[1] * temp[1]];
	return ret;
}


var attacksHandler = function(game,diff){
	var i = 0;
	var attacks = game.attacks;
	var ranged = game.ranged;
	var arr = [];
	var a;
	while(attacks.length > 0){
		a = attacks.pop();
		//console.log(a);
		if(a.type == "ranged"){
			//console.log("pushed a ranged");
			ranged.push(a);
			game.sounds.gunshot.play();

		}
	}
	while(ranged.length > 0){
		a = ranged.pop();
		a.pos[0] += a.dir[0] * a.speed;
		a.pos[1] += a.dir[1] * a.speed;
		a.traveled += a.speed;
		for(i = 1; i < game.elts.length; i++){
			if(detectHit(game.elts[i], a)){
				a.collided = true;
				a.damage -= (a.traveled/600) * 50; 
				game.elts[i].health -= a.damage;
				var m = game.sounds.impact.play();
				//console.log("collision detected!");
			}
		}
		if(a.pos[0] > 0 && a.pos[0] < 600 && a.pos[1] > 0 && a.pos[1] < 600 && !a.collided){
			arr.push(a);
		}
	}
	game.ranged = arr;
}

var detectHit = function(elt, attack){
	e2 = [elt.pos[0] + elt.size[0], elt.pos[1] + elt.size[1]];
	a2 = [attack.pos[0] + attack.dir[0]*attack.speed, attack.pos[1] + attack.dir[1]*attack.speed];
	if( elt.pos[0] < a2[0] && e2[0] > attack.pos[0] && elt.pos[1] < a2[1] && e2[1] > attack.pos[1]){
		return true;
	}
	else{
		return false;
	}
}

var updateElts = function (game, diff) {

	var i = 0;
	var temp;
	var s;
	for(i = 0; i < game.elts.length; i++){
		temp = game.elts[i];
		if(temp.type == "player" && game.player.health > 0){
			game.elts[i] = playerMoveHandler(game.elts[i], game.elts, diff);
		}
		else if(temp.type == "enemy"){
			if(temp.health > 0){
				game.elts[i] = enemyMoveHandler(game.elts[i], game.elts[0], diff);
			}
			else{
				temp = game.elts.splice(i,1);
				s = game.sounds.mDeath.play();
				setTimeout(function(){
					var s = game.sounds.splat.play();
					//s.volume = .3;
					s.play();
				},400);
				
				game.dead.push(temp[0]);
				game.kills++;
				game.uiFlag = true;
			}
			
		}
	}
	return game.elts;
}


var drawElts = function (game,canvas){
	var elts = game.elts;
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,600,600);
	
	
	for(var i = 0; i < elts.length; i++){
		////console.log[i];
		if(elts[i].type == "player"){
			playerDrawHandler(game, canvas, elts[i]);
		}
		else if(elts[i].type == "enemy"){
			enemyDrawHandler(game, canvas, elts[i]);
		}
	}
}

var drawRanged = function (canvas, ranged){
	var ctx = canvas.getContext("2d");
	var i = 0;
	var a;
	for(i = 0; i < ranged.length; i++){
		a = ranged[i];
		//console.log("drawing");
		ctx.save();
		ctx.globalAlpha = .2;
		ctx.fillStyle = "yellow";
		ctx.translate(a.pos[0], a.pos[1]);
		ctx.rotate(a.rot)
		ctx.translate(-(a.pos[0]), -(a.pos[1]));
		ctx.fillRect(a.pos[0]+1,a.pos[1]-50,2,50);
		
		ctx.fill();
		ctx.restore();
	}
	

}

var drawDead = function(canvas, game){
	var i = 0;
	var ctx = canvas.getContext("2d");
	var temp;
	var val;
	for(i = 0; i < game.dead.length; i++){
		temp = game.dead[i];
		val = Math.floor(temp.corpseTime/50);
		var img_death = game.images.death;
		ctx.save();
		//console.log(temp);
		ctx.translate(temp.pos[0] + 25, temp.pos[1] + 50)
		ctx.rotate(temp.rot);
		ctx.translate(-(temp.pos[0]+ 25), -(temp.pos[1] + 50));
		if(val < 6){
			ctx.drawImage(img_death,val*50, 0, 50,100, temp.pos[0], temp.pos[1],50,100);
		}
		else{
			ctx.drawImage(img_death, 250, 0, 50,100,temp.pos[0], temp.pos[1],50,100);
		}
		ctx.restore();
	}
}


var updateDead = function(game, diff){
	var i = 0;
	for(i = 0; i < game.dead.length; i++){
		game.dead[i].corpseTime += diff;
		if(game.dead[i].corpseTime > 10000){
			game.dead.splice(i,1);
		}
	}
}

var drawBackground = function(canvas, game){

			var ctx1 = canvas.getContext('2d');
			ctx1.drawImage(game.images.bg,0,0,600,600,0,0,600,600);
			//game.bg = true;
	 	//console.log("initialzed bg");
}

var drawUi = function(canvas, game){
	//console.log("drew ui");

 var ctx = canvas.getContext("2d");
 ctx.clearRect(0,0,600,600);
  ctx.fillStyle = 'red';
  ctx.font= '50px ilits';
  ctx.textBaseline = 'top';
  ctx.fillText  (game.kills, 300, 10);
}

var drawGameOver = function(canvas, game){
	//console.log("drew ui");
	var count = 0;
	var ctx = canvas.getContext("2d");
    ctx.fillStyle = 'red';
    ctx.font= '50px ilits';
    ctx.textBaseline = 'top';
    ctx.fillText  ("You Died.", 235, 300);
}


var drawBlackout = function(canvas, game){
	 var ctx = canvas.getContext("2d");
     var id;
	
	 var time = 0;
	

	 id = setInterval( function () {
	 		time+=.05
	 		ctx.fillStyle = "rgba(0,0,0," + time + ")";
	 		ctx.fillRect(0,0,600,600);
	 	}, 100);
	 setTimeout(function() {
	 	clearInterval(id);
	 	drawGameOver(canvas, game);
	
	 },2000);
}

var drawBlackin = function(canvas, game){
	 var ctx = canvas.getContext("2d");
     var id;
	 game.bgFlag = true;
	 var time = 1;
	 ctx.fillRect(0,0,600,600);

	 id = setInterval( function () {
	 		ctx.clearRect(0,0,600,600);

	 		time-=.05
	 		if(time>=0){
		 		ctx.fillStyle = "rgba(0,0,0," + time + ")";
		 		ctx.fillRect(0,0,600,600);
	 		}

	 		drawShadow(canvas);
	 	}, 100);
	 
	 setTimeout(function() {
	 	clearInterval(id);
	 	
	 
	 },2000);
	 
}



var draw = function() {	

	window.requestAnimationFrame(draw);

	if(!game.bgFlag){
		drawBlackin(game.canvas3,game);
	}
	
	if(game.player.health <= 0 && game.over == false){
		drawBlackout(game.canvas3,game);
		game.over = true;
	}
	else if(!game.over){
		drawUi(game.canvas4, game);
	}

	drawBackground(game.canvas1,  game);
	drawElts(game, game.canvas2);
	drawRanged(game.canvas2, game.ranged);
	drawDead(game.canvas1, game)

}

var soundPool = function(){
 	console.log("new soundpool!");
	this.pool = [];
	this.current = 0;
	this.num = 0;
	this.ready = false;
	this.loaded = 0;
	this.init = function (resc){
		var s = this;
		s.num = resc.num;
		console.log("initializing soundpool");
		console.log(resc);
		for(var i = 0; i < s.num; i++){
			var temp = new Audio();
			console.log("FUUUUCK");
			temp.oncanplaythrough = function(){
				console.log(this);
				console.log("ROFLLLL");
				s.loaded++;
				if(s.num == s.loaded){
					s.ready = true;
				}
			}
			temp.src = resc.path;
			//temp.play();
			this.pool.push(temp);
		}
		
	}

	this.play = function(){
		for(var i = 0; i < this.num; i++){
			this.current = (this.current + 1)%this.num;
			if(this.pool[this.current].currentTime == 0 || this.pool[this.current].ended){
				this.pool[this.current].play();
				break;
			}
		}
	}
}

var loadResources = function(game, resc){
	var n = 0;
	var loaded = 0;
	var temp;
	var soundFlag = false;
	for(var i = 0; i < n; i++){
		if(resc[i].type == "image"){
			n++;
		}
	}

	for(var i = 0; i < resc.length; i++){
	//	console.log(resc[i]);
		if(resc[i].type == "image"){
			game.images[resc[i].name] = new Image();
			game.images[resc[i].name].onload = function(){
			}
			game.images[resc[i].name].src = resc[i].path
		}
		else if(resc[i].type == "sound"){
			n++;
			var t = new soundPool();
			game.sounds[resc[i].name] = t;
			game.sounds[resc[i].name].init(resc[i]);
				//console.log(loaded);
			}
		}
		for(key in game.sounds){
			console.log(key);
		}

	var myInterval = setInterval(function(){
		soundFlag = true;	
		console.log(game.sounds)
		for(var key in game.sounds){
			//console.log(key);
			if(!game.sounds[key].ready){
				console.log(key);
				soundFlag = false;
				console.log("sounds still loading");
				loaded = 0;
				break; 
			}
			else{
				loaded++;
			}
		}
		console.log(soundFlag);
		console.log(loaded);
		if(soundFlag == true && loaded == n){
			console.log("sounds finished loading!")
			clearInterval(myInterval);
			game.startup();
		}
	}, 1000);
}

function Game(){



	this.over = false;
	this.elts = [];
	this.player = null;
	this.pos = [0,0];
	this.loaded = false;
	this.attacks = [];
	this.ranged = [];
	this.dead = [];
	this.wave = 1;
	this.bgflag = false;
	this.kills = 0;
	this.uiFlag = false;
	this.resources = [];
	this.sounds = {};
	this.images = {};


	this.canvas1 = document.getElementById('canvas1');
	this.canvas2 = document.getElementById('canvas2');
	this.canvas3 = document.getElementById('canvas3');
	this.canvas4 = document.getElementById('canvas4')

	this.addResc = function(type, name, path, num){
			var temp = new Resource();
			temp.init(type,name,path, num);
			this.resources.push(temp);
	}

	this.defResc = function(){

		this.addResc("sound","gunshot","sounds/ak.wav", 50);
		this.addResc("sound","impact","sounds/impact.wav", 20);
		this.addResc("sound","mDeath","sounds/monsterDeath.wav", 20);
		this.addResc("sound","splat","sounds/splat.wav", 20);
		this.addResc("sound","ambient","sounds/ambient.mp3", 1);
		this.addResc("sound","concrete1","sounds/concrete1.wav", 20);
		this.addResc("sound","concrete2","sounds/concrete2.wav", 20);
		this.addResc("image","bg","textures/asphalt.png",1);
		this.addResc("image","player","sprites/player.png",1);
		this.addResc("image","enemy","sprites/enemy.png",1);
		this.addResc("image","death","sprites/death.png",1);
		this.addResc("image","muzzle","sprites/muzzle.png",1);


	}

	this.init = function() {

		this.player = new Player();
		this.elts.push(this.player);


		this.defResc();
		loadResources(this, this.resources);
		//console.log("inited");		
	  }

	this.spawn = function () {
		var game = this;
		//console.log(this);
		//console.log("WTF");
		this.wave = 1;
		setInterval( function(){
			game.wave++;
			var n = Math.floor(Math.random() * game.wave);
			for(var i = 0; i < n; i++){
				var enemy = new Enemy();
				enemy.id = i;
				enemy.init();
				enemy.speed = .01 + Math.random() * (game.wave/100);
				game.elts.push(enemy);
			}
			console.log(game);
		}, 5000);
		
	}

	this.startup = function() {
	
		draw();
		//console.log(this.sounds);
		this.sounds.ambient.pool[0].loop = true;
		this.sounds.ambient.pool[0].play();
		all();
	}
}

var drawShadow = function(canvas) {
	//console.log("drew shadow");
	var ctx = canvas.getContext("2d"); 
	var gradient = ctx.createRadialGradient(300, 300, 25,
                                            300, 300, 250);
	 gradient.addColorStop(1, 'rgba(0,0,0,1)');
	 gradient.addColorStop(0, 'rgba(0,0,0,0)');
	 ctx.fillStyle = gradient;
	 ctx.fillRect(0,0,600,600);

}



var game = new Game();
game.init();

var all = function () {
	$('body').keydown(function(e) {
		  game.player.move = keyHandler(game, e.keyCode, true);
		});

		$('body').keyup(function(e) {
		  game.player.move = keyHandler(game, e.keyCode, false);
		});



	var then = Date.now();
	var diff = 0;

	game.spawn();
	setInterval( function () {
		    	
			    now = Date.now();
			    diff = now - then;
			    //console.log(game.elts);
			   	attacksHandler(game, diff);
				game.elts = updateElts(game, diff);
				updateDead(game, diff);
				

			    then = now; 
			},1000/60);
	}
		
}







// player.shot = setInterval(function(){
