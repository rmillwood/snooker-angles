var defaultFriction = 0.98;
var coefficientOfFriction = defaultFriction;
var defaultRestitution = 0.9;
var coefficientOfRestitution = defaultRestitution;
var ballNudge = 80;
var shotButton;
var tries;
var ball;
var board;
var pockets;
var stoppedSpeed = 0.1;

function Ball(elt) {
	var ball = this;

	ball.elt = elt;
	ball.v = {x: 0, y: 0};

	ball.r = function(newr) {
		if(typeof newr !== "undefined")
			elt.r.baseVal.value = newr;
		return elt.r.baseVal.value;
	};

	ball.x = function(newx) {
		if(typeof newx !== "undefined")
			elt.cx.baseVal.value = newx;
		return elt.cx.baseVal.value;
	};

	ball.y = function(newy) {
		if(typeof newy !== "undefined")
			elt.cy.baseVal.value = newy;
		return elt.cy.baseVal.value;
	};

	ball.move = function(dx, dy) {
		ball.x(ball.x() + dx);
		ball.y(ball.y() + dy);
	};
}

function main() {
	setDefaultValues();
	attachKeyPadHandlers();
	ball = new Ball(document.getElementById('ball'));
	ball.move(
		(2*Math.random() - 1) * ballNudge,
		(2*Math.random() - 1) * ballNudge);

	realPockets = document.getElementsByClassName('pocket');
	pockets = new Array(realPockets.length);
	for(var i = 0; i < realPockets.length; i++) {
		pockets[i] = {
			x: realPockets[i].cx.baseVal.value,
			y: realPockets[i].cy.baseVal.value,
			r: realPockets[i].r.baseVal.value
		};
	}

	realBoard = document.getElementById('board');
	board = {
		left: realBoard.x.baseVal.value,
		right: realBoard.x.baseVal.value + realBoard.width.baseVal.value,
		top: realBoard.y.baseVal.value,
		bottom: realBoard.y.baseVal.value + realBoard.height.baseVal.value
	};

	shotButton = document.getElementById('takeShot');
	shotButton.addEventListener('click', takeShot, false);
	shotButton.disabled = false;
	tries = 0;
}

addEventListener('load', function(){ try { main(); } catch(e) { alert(e.msg); } }, false);

function takeShot(ev) {
	var deg = document.getElementById('angle_text').value;
	deg = +deg + 90; //NASTY HACK RELATED TO HACK TO ROTATED TABLE IN SVG
	var rad = deg * Math.PI / 180;
	var power = document.getElementById('power_range').value;	
	tries += 1;
	ball.v.x = power * Math.sin(rad);
	ball.v.y = -power * Math.cos(rad);
	shotButton.disabled = true;
	frame(ball);
}

function frame(ball) {

	if(ball.v.x == 0 && ball.v.y == 0) {
		shotButton.disabled = false;
		return;
	}
	var x = ball.x();
	var y = ball.y();
	var r = ball.r();
	var pocket = checkPocket(ball);
	if(pocket)
	{
		var towards = {x: pocket.x - x, y: pocket.y - y};
		var d = norm(towards);
		if(d < 2) {
			ball.elt.style.opacity = 0;
			var msg = 'You win! ';

			if(tries <= 0)
				msg += 'I think you cheated though :(';
			else if(tries == 1)
				msg += 'Nice shot!';
			else {
				msg += 'You took ' + tries + ' tries. ';
				if(tries <= 3)
					msg += 'Not bad!';
				else if(tries <= 10)
					msg += 'I bet you can do better!';
				else
					msg += 'Good grief.';
			}
			alert(msg);
			ball.x(156);
			ball.y(156);
			ball.move(
					(2*Math.random() - 1) * ballNudge,
					(2*Math.random() - 1) * ballNudge);
			ball.elt.style.opacity = 1;
			shotButton.disabled = false;
			tries = 0;
			return;
		}
		else
		{
			towards = setlength(towards, d - 2);
			ball.elt.style.opacity = d / (r + pocket.r);
			ball.x(pocket.x - towards.x);
			ball.y(pocket.y - towards.y);
			setTimeout(function(){ frame(ball); }, 40);
			return;
		}
	}

	setTimeout(function(){ frame(ball); }, 40);

	x += ball.v.x;
	y += ball.v.y;

	ball.v = friction(ball.v);

	if(x - r < board.left) {
		ball.v.x = -coefficientOfRestitution * ball.v.x;
		x = 2 * (board.left + r) - x;
	} else if(x + r > board.right) {
		ball.v.x = -coefficientOfRestitution * ball.v.x;
		x = 2 * (board.right - r) - x;
	}

	if(y - r < board.top) {
		ball.v.y = -coefficientOfRestitution * ball.v.y;
		y = 2 * (board.top + r) - y;
	} else if(y + r > board.bottom) {
		ball.v.y = -coefficientOfRestitution * ball.v.y;
		y = 2 * (board.bottom - r) - y;
	}

	ball.x(x);
	ball.y(y);
}

function checkPocket(ball)
{
	var bx = ball.x(), by = ball.y(), br = ball.r();
	for(var i = 0; i < pockets.length; i++) {
		var pocket = pockets[i];

		if(norm({x: bx - pocket.x, y: by - pocket.y}) < br + pocket.r)
			return pocket;
	}

	return null;
}

function friction(v) {
	var speed = norm(v);

	if(speed <= stoppedSpeed)
		return {x: 0, y: 0};
	else
		speed *= coefficientOfFriction;
	;
	return setlength(v, speed);
}

function setlength(v, s) {
	var q = s/norm(v);
	return {x: v.x * q, y: v.y * q};
}

function norm(v) {
	return Math.sqrt(v.x*v.x + v.y*v.y);
}

function navigateToAppPage(appPageId) { 
    var appPages = document.getElementsByClassName('appPage');
    for ( var i = 0; i < appPages.length; i++ ) {
         if (appPages[i].id == appPageId) {
            appPages[i].style.display = "block";
            }
         else {
            appPages[i].style.display = "none";
            }
         }  
}

function attachKeyPadHandlers(){
  var the_nums = document.getElementsByName('digit');
  for (var i=0; i < the_nums.length; i++) { the_nums[i].onclick=addDigit; }
  var delete_key = document.getElementsByName('delete');
  delete_key[0].onclick=deleteDigit;
}

function addDigit() {
var digits = document.getElementById('angle_text');
if (digits.value=='0') { digits.value = this.value; } 
else if (digits.value.length < digits.size) { digits.value += this.value; }
}

function deleteDigit() {
var digits = document.getElementById('angle_text');
digits.value = digits.value.slice(0, -1);
if (digits.value.length==0) {digits.value='0';}
}

function syncValue(input1ID, input2ID) { 
	document.getElementById(input1ID).value=document.getElementById(input2ID).value;
	}
	
function setDefaultValues() { 
	document.getElementById('friction_text').value=defaultFriction; 
	document.getElementById('restitution_text').value=defaultRestitution; 
	syncValue('friction_range','friction_text'); 
	syncValue('restitution_range','restitution_text');
	}

function setFrictionValueFromRange() {
	coefficientOfFriction = 1 * document.getElementById('friction_range').value;
	syncValue('friction_text','friction_range');
}
function setRestitutionValueFromRange() {
	coefficientOfRestitution = 1 * document.getElementById('restitution_range').value;
	syncValue('restitution_text','restitution_range');
	
}
