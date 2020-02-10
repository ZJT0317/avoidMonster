var characters=document.getElementsByClassName('characters')[0];


var config = {
	containterWidth:512,
	containterHeight:480
}

var hero = {
	dom: document.createElement('div'),
	width: 32,
	height: 32,
	isInit: false,
	left: 0,
	top: 0,
	speed: 150,
	xSpeed: 0,
	ySpeed: 0,
	show: function(){
		if(!this.isInit){
			this.dom.className= 'hero';
			characters.appendChild(this.dom);
			this.isInit=true;
			this.left= config.containterWidth/2 - this.width/2;
			this.top= config.containterHeight/2 - this.height/2;
		}
		this.dom.style.left=this.left+'px';
		this.dom.style.top=this.top+'px';
	},
	Event: function(){
		var that=this;
		window.onkeydown = function(e){
			if(e.keyCode == 38){
				that.ySpeed= -that.speed;
			}
			else if(e.keyCode == 40){
				that.ySpeed= that.speed;
			}
			else if(e.keyCode == 37){
				that.xSpeed= -that.speed;
			}
			else if(e.keyCode == 39){
				that.xSpeed= that.speed;
			}
		}
		window.onkeyup = function(e){
			if(e.keyCode == 38||e.keyCode == 40){
				that.ySpeed=0;
			}
			else if(e.keyCode == 37||e.keyCode == 39){
				that.xSpeed=0;
			}
		}
	},
	move: function(duration){
		var newLeft= this.xSpeed*duration;
		var newTop=this.ySpeed*duration;
		var DisX=this.left+newLeft;
		var DisY=this.top+newTop;
	    if(DisX<0){
			DisX=0;
		}
		else if(DisX>512-this.width){
			DisX=512-this.width;
		}
		if(DisY<0){
			DisY=0;
		}
		else if(DisY>480-this.height){
			DisY=480-this.height;
		}
		this.left=DisX;
		this.top=DisY;
		this.show();
	}
}


function getRandom(min,max){
	return Math.floor(Math.random()*(max-min)+min);
}
function createMonster(){
	var monster={
		dom: document.createElement('div'),
		width: 30,
		height: 32,
		isInit: false,
		left: 0,
		top: 0,
		speed: 150,
		xSpeed: getRandom(40,100),
		ySpeed: getRandom(40,100),
		show: function(){
			if(!this.isInit){
				this.dom.className= 'monster';
				characters.appendChild(this.dom);
				this.isInit=true;
			}
			this.dom.style.left=this.left+'px';
			this.dom.style.top=this.top+'px';
		},
		move: function(duration){
			var newLeft= this.xSpeed*duration;
			var newTop=this.ySpeed*duration;
			var DisX=this.left+newLeft;
			var DisY=this.top+newTop;
		    if(DisX<0){
				DisX=0;
				this.xSpeed=-this.xSpeed;
			}
			else if(DisX>512-this.width){
				DisX=512-this.width;
				this.xSpeed=-this.xSpeed;
			}
			if(DisY<0){
				DisY=0;
				this.ySpeed=-this.ySpeed;
			}
			else if(DisY>480-this.height){
				DisY=480-this.height;
				this.ySpeed=-this.ySpeed;
			}
			this.left=DisX;
			this.top=DisY;
			this.show();
		}
	}
	monster.show();
	return monster;
}

var monsters=[];
var MonsterAppearTime=1500;
var moveMonsterTime;
var moveAllTime;

function isHit(){
	var heroX=hero.left-hero.width/2;
	var heroY=hero.top-hero.height/2;
	for(var i=0;i<monsters.length;++i){
		var m=monsters[i];
		var mX=m.left-m.width/2;
		var mY=m.top-m.height/2;
		if(Math.abs(mX-heroX)<(hero.width+m.width-12)/2&&Math.abs(mY-heroY)<(hero.height+m.height-12)/2){
			return true;
		}
	}
	return false;
}
/**
 * 定时器对象
 */
var count=0;
var timer;
var time={
	strCount: '',
	count: 0,
	dom: document.getElementsByClassName('time')[0],
	start: function(){
		var that=this;
		timer=setInterval(function(){
			that.count+=16;
			strCount=that.string();
			that.dom.innerHTML=strCount;
	},16)},
	string: function(){
		var minute=Math.floor(this.count/60000);              
		var secondAll=this.count-minute*60000;    
		var second=Math.floor(secondAll/1000);           
		var miliSec=secondAll-second*1000;
		minute = minute.toString().padStart(2, "0");
		second = second.toString().padStart(2, "0");
		//毫秒必须是两位数
		miliSec = Math.floor(miliSec / 10).toString().padStart(2, "0");
		return  minute + ":" + second + ":" + miliSec;
	}
}

/**
 * 判断怪物与英雄是否亲密接触
 */
function init(){
	var second=16/1000;
	hero.show();
	hero.Event();
	time.start();
	moveMonsterTime=setInterval(function(){
		var m=createMonster();
		monsters.push(m);
	},MonsterAppearTime)
	moveAllTime=setInterval(function(){
		hero.move(second);
		for(var i=0;i<monsters.length;++i){
			monsters[i].move(second);
		}
		if(isHit()){
			clearInterval(moveAllTime);
			clearInterval(moveMonsterTime);
			clearInterval(timer);
			alert('用时为: '+time.string()+'\n游戏结束!!!');
		}
	},16);
}
init();