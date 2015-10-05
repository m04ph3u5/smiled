 angular.module('smiled.application').factory('socialGraphSketch', ['userService',
     function socialGraphSketch(userService){
	 
	return function(p5){
		var nodi={};
		var archi=[];
		var ranks={}; //stato dei nodi al tempo corrente;
		var events = [];

		var w;
		var h;
		//Nodi soggetti a trasformazione
		var dragged=null;
		var inside=null;
		var flashing=null;
		var flashingRadius=0;

		var draggingBar=false;
		var barra=0;

		//Variabili legate alla simulazione fisica delle particelle
		var t=0.1; //agitazione termica;
		var dt=0.1; //intervallo di integrazione
		var k=0.5; //coefficiente elastico
		var q=400000; //forza elettrica
		var l0=0;
		var g=80; //forza di gravità
		var friction=0.5;

		//TODO modificare prelievo id - url da service
		
		p5.preload = function() {
		  var id = userService.getScenarioId();
		  var url = '/api/v1/scenarios/'+id+'/socialGraph';
		  events = p5.loadJSON(url);
		  var container = angular.element(document.querySelector('#container-graph'));
		  w = container.width();
		  h = parseInt((w*3)/4);
		}
		
		var createNodeState = function() {
		  var ns={};
		  ns.links={};
		  for(var id in nodi){
			  ns.links[id]=0;
		  }
		  ns.posts=0;
		  ns.getRadius = function() {
		    return (p5.log(ns.posts+1)/p5.log(1.2)+10)*0.75;
		  }
		  return ns;
		}
		
		var createNode = function(id, name) {
			  var node= {
			    id:id, 
			    name:name, 
			    x: [p5.random(0,p5.width) ,0,0,0,0], 
			    y: [p5.random(0,p5.height),0,0,0,0],
			    targets: [],
			    vx: 0.0,
			    vy: 0.0,
			    ax: 0.0,
			    ay: 0.0,
			    phase: p5.random(0,p5.TWO_PI)
			  };
			  node.setX= function(x) {
			    var xs=p5.shorten(node.x);
			    node.x=p5.splice(xs,x,0);    
			  }
			  node.setY= function(y) {
			    var ys=p5.shorten(node.y);
			    node.y=p5.splice(ys,y,0);
			  }
			  node.getX= function() {
			    return node.x[0];
			  }
			  node.getY= function() {
			    return node.y[0];
			  }
			  node.getLastX= function() {
			    return node.x[4];
			  }
			  node.getLastY= function() {
			    return node.y[4];
			  }
			  node.getName=function() {
			    return node.name;
			  }
			  node.getId=function() {
			    return node.id;
			  }
			  node.getTargets=function() {
			    return node.targets;
			  }
			  node.addTarget=function(id) {
			    node.targets.push(id);
			  }
			  node.draw = function(drawHistory) {
			    var nodeState=ranks[id];
			    var r=nodeState.getRadius()*2;
			    var start=drawHistory? node.x.length-1:0;
			    for (var i=start; i>=0; i--) {
			      var sat=255-128/p5.pow(p5.sq(node.vx)+p5.sq(node.vy)+1,0.3);
			      p5.push();
			        p5.colorMode(p5.RGB);
			        var alpha=p5.map(i, node.x.length,0,0,1);
			        alpha=p5.pow(alpha,3)*255;
			        p5.stroke(64,75,65,alpha);
//			        p5.colorMode(p5.HSB);
			        p5.fill(137,177,81,alpha);
			        var r1=p5.map(i,0,node.x.length,r,0);
			        p5.ellipse(node.x[i],node.y[i],r1,r1);
			      p5.pop();
			    }
			  }
			  node.flash = function() {
				p5.push();
			      var ns=ranks[node.id];
			      var r=ns.getRadius()*2;
			      p5.fill(250,215,123,128);
			      p5.noStroke();
			      p5.ellipse(node.getX(),node.getY(),flashingRadius*r,flashingRadius*r);
			    p5.pop();
			  }
			  return node;
			}
		
		p5.setup = function() {
			p5.createCanvas(w,h);
			  for (var i in events) {
			    var e=events[i];
			    var autore=e.author;
			    autore.x=p5.random(0,p5.width);
			    autore.y=p5.random(0,p5.height);
			    var id=autore.id;
			    if (nodi[id]!=={}) {
			      nodi[id]=createNode(id,autore.name);
			      ranks[id]=createNodeState();
			    }
			    switch (e.action) {
			      case "POST":
			        archi.push({from:id, to:id})
			        break;
			      case "TAG":
			      case "LIKE":
			      case "COMMENT":
			        var oggetto=e.object;
			        var id1=oggetto.id;
			        if (nodi[id1]!=={}) {
			          nodi[id1]=createNode(id1,oggetto.name);
			          ranks[id1]=createNodeState();
			        }
			        archi.push({from:id, to:id1})
			        break;
			    }
			  }
			}
		
		p5.draw =function() {
			if(p5.touchIsDown){
				p5.mouseX=p5.touchX;
				p5.mouseY=p5.touchY;
			}
			  flashingRadius*=0.95;
			  if (draggingBar) {
			    barra=p5.map(p5.mouseX,20,p5.width-20,0,archi.length);
			    barra=p5.floor(p5.constrain(barra,0,archi.length));
			    flashingRadius=3;
			  } else if (dragged!==null) {
			    dragged.setX(p5.mouseX);    
			    dragged.setY(p5.mouseY);
			  }
			  
			  p5.background(245,242,234);
			  p5.stroke(64,75,65);
			  
			  var dx=0;
			  var dy=0;
			  var dx0=0;
			  var dy0=0;
			  var ns=null;
			  var f=0;
			  
			  for (var i in nodi) {
			    var nodo=nodi[i];
			    var targets=nodo.getTargets();
			    //calcolo d0, distanza del nodo dal centro del canvas e applico la forza di gravità
			    dx0=nodo.getX()-p5.width/2;
			    dy0=nodo.getY()-p5.height/2;
			    var d0=p5.sqrt(p5.sq(dx0)+p5.sq(dy0));
			    if (d0<1) d0=1;
			    var mass=1;
			    ns=ranks[nodo.getId()];
			    if (ns) mass+=ns.posts/3;
			    nodo.ax= -g*mass*dx0/d0;
			    nodo.ay= -g*mass*dy0/d0;
			    //calcolo la forza di repulsione reciproca tra tutte le particelle
			    for (var j in nodi) {
			      if (i==j) continue;
			      var m=nodi[j];
			      dx=nodo.getX()-m.getX();
			      dy=nodo.getY()-m.getY();
			      var d=p5.pow(p5.sq(dx)+p5.sq(dy),1.5);
			      if (d<10) {
			        //se i due nodi quasi coincidono, genero una forza intensa in una direzione casuale
//			        var a=p5.TWO_PI*p5.noise(p5.frameCount*0.01);
//			        dx=p5.cos(a);
//			        dy=p5.sin(a);
			        d=10;
			      }
			      f=q*(mass+1);
			      nodo.ax+=f*dx/d;
			      nodo.ay+=f*dy/d;
			    }
			  }
			  ranks={};
			  for (i in nodi) {
			    ranks[i]=createNodeState();
			  }
			  for (i=0; i<barra; i++) {
			    var arco=archi[i];
			    var n1=nodi[arco.from];
			    var m1=nodi[arco.to];
			    ns=ranks[arco.from];
			    if (arco.from!==arco.to) {
			      ns.links[arco.to]++;
			      flashing=null;
			    } else {
			      flashing=n1;
			      ns.posts++;
			    }
			    ranks[arco.from]=ns;
			    var ms=ranks[arco.to];
			    if (arco.from!==arco.to) ms.links[arco.from]++;
			    ranks[arco.to]=ms;
			    dx=n1.getX()-m1.getX();
			    dy=n1.getY()-m1.getY();
			    //disegno l'arco da n1 a m1 come curva di bezier di tipo quadratico
			    p5.push();
			      p5.noFill();
			      p5.strokeWeight((p5.log(ns.links[arco.to])+1)/p5.log(2));
			      var xa=(n1.getLastX()+m1.getLastX())*0.5;
			      var ya=(n1.getLastY()+m1.getLastY())*0.5;
			      p5.bezier(n1.getX(),n1.getY(), xa,ya, xa,ya, m1.getX(),m1.getY());
			    p5.pop();
			    //applico la forza elastica di attrazione lungo l'arco
			    n1.ax+= -k*dx;
			    n1.ay+= -k*dy;
			    m1.ax+=  k*dx;
			    m1.ay+=  k*dy;
			  }
			  f=p5.frameCount*p5.sqrt(t)/p5.TWO_PI;
			  for (var i18 in nodi) {
			    var n2=nodi[i18];
			    if (flashing===n2) n2.flash();
			    n2.draw(n2!==dragged);
			    
			    //aggiorno la velocità
			    n2.vx+=n2.ax*dt;
			    n2.vy+=n2.ay*dt;

			    //introduco l'attrito
			    n2.vx*=friction;
			    n2.vy*=friction;
			    
			    //agitazione termica
			    n2.vx+=t*p5.sin(f+n2.phase);
			    n2.vy+=t*p5.cos(f+n2.phase);
			    
			    //aggiorno la posizione
			    n2.setX(n2.getX()+n2.vx*dt);
			    n2.setY(n2.getY()+n2.vy*dt);
			  
			    //forzo le particelle dentro il canvas
			    if (n2.getX()<5) {
			      n2.setX(5);
			      n2.vx*= -1;
			    } else if (n2.getX()>p5.width-5) {
			      n2.setX(p5.width-5);
			      n2.vx*= -1;
			    }
			    if (n2.getY()<5) {
			      n2.setY(5);
			      n2.vy*= -1;
			    } else if (n2.getY()> p5.height-5) {
			      n2.setY(p5.height-5);
			      n2.vy*= -1;
			    }
			  }
			  if (inside) {
				p5.push();
				  p5.fill(224);
				  p5.stroke(128);
				  p5.rect(inside.getX()+10, inside.getY()+10,10+p5.textWidth(inside.getName()),25);
				  p5.fill(0);
				  p5.text(inside.getName(), inside.getX()+15, inside.getY()+28);
				p5.pop();
			  }
			  //disegno lo slider
			  p5.push();
			    p5.stroke(255);
			    p5.strokeWeight(3);
			    p5.line(20,p5.height-20,p5.width-20,p5.height-20);
			    p5.stroke(0);
			    p5.strokeWeight(1);
			    p5.line(20,p5.height-20,p5.width-20,p5.height-20);
			    var x4=p5.map(barra,0,archi.length,20, p5.width-20);
			    var y4=p5.height-20;
			    p5.stroke(0);
			    p5.colorMode(p5.HSB,255);
			    p5.fill(36,120,196);
			    p5.ellipse(x4,y4,20,20);
			    p5.noStroke();
			    for (i=10; i>0; i--) {
			      p5.fill(36,120,226-3*i);
			      p5.ellipse(x4-2,y4-2,i,i);
			    }
		            p5.colorMode(p5.RGB);
			  p5.pop();
			}
		
		p5.mousePressed = function() {
			  var x=p5.map(barra,0,archi.length,20,p5.width-20);
			  var y=p5.height-20;
			  var dx=p5.mouseX-x;
			  var dy=p5.mouseY-y;
			  var d=p5.sq(dx)+p5.sq(dy);
			  if (d<400) 
			    draggingBar=true;
			  

			  for (var i in nodi) {
			    var nodo=nodi[i];
			    dx=p5.mouseX-nodo.getX();
			    dy=p5.mouseY-nodo.getY();
			    d=p5.sq(dx)+p5.sq(dy);
			    var id=nodo.getId();
			    var r=25;
			    var ns=ranks[id];
			    if (ns) 
			      r=ns.getRadius();
			    if (d<r*r) {
			      dragged=nodo;
			      return;
			    }
			  }
			}
		
		p5.touchStarted = function() {
			  var x=p5.map(barra,0,archi.length,20,p5.width-20);
			  var y=p5.height-20;
			  var dx=p5.touchX-x;
			  var dy=p5.touchY-y;
			  var d=p5.sq(dx)+p5.sq(dy);
			  if (d<1000) 
			    draggingBar=true;
			  

			  for (var i in nodi) {
			    var nodo=nodi[i];
			    dx=p5.touchX-nodo.getX();
			    dy=p5.touchY-nodo.getY();
			    d=p5.sq(dx)+p5.sq(dy);
			    var id=nodo.getId();
			    var r=25;
			    var ns=ranks[id];
			    if (ns) 
			      r=ns.getRadius();
			    if (d*0.25<r*r) {
			      dragged=nodo;
			      return true;
			    }
			  }
			  
			  return true;
			}
		
		p5.mouseMoved = function() {
			  inside=null;
			  for (var id in nodi) {
			    var n=nodi[id];
			    var ns=ranks[id];
			    if (!ns) ns=createNodeState();
			    var r=ns.getRadius();
			    var dx=p5.mouseX-n.getX();
			    var dy=p5.mouseY-n.getY();
			    var d=p5.sq(dx)+p5.sq(dy);
			    if (d<r*r) {
			      inside=n;
			      break;
			    }
			  }
			}
		
		p5.touchMoved = function() {
			  inside=null;
			  for (var id in nodi) {
			    var n=nodi[id];
			    var ns=ranks[id];
			    if (!ns) ns=createNodeState();
			    var r=ns.getRadius();
			    var dx=p5.touchX-n.getX();
			    var dy=p5.touchY-n.getY();
			    var d=p5.sq(dx)+p5.sq(dy);
			    if (d*0.25<r*r) {
			      inside=n;
			      break;
			    }
			  }
			  return true;
			}
		
		p5.mouseReleased = function() {
			  dragged=null;
			  draggingBar=false;
			}
		
		p5.touchEnded = function() {
			  dragged=null;
			  draggingBar=false;
			  return true;
			}

		var shuffleNodes = function() {
			  for (var id in nodi) {
			    var nodo=nodi[id]
			    nodo.setX(p5.random(0,p5.width));
			    nodo.setY(p5.random(0,p5.height));
			  }
			}
		
		p5.keyTyped = function() {
			  switch (p5.key) {
			    case ' ':
			    case '+':
			      barra=p5.constrain(barra+1,0,archi.length);
			      flashingRadius=3;
			      break;
			    case '-':
			      barra=p5.constrain(barra-1,0,archi.length);
			      flashingRadius=3;
			      break;
			    case 'c':
			    case 'C':
			      barra=0;
			      flashingRadius=0;
			      break;  
			    case 's':
			    case 'S':
			      shuffleNodes();
			      break;
			    case 'h':
			    case 'H':
			      t=p5.min(10,t*1.25);
			      break;
			    case 'l':
			    case 'L':
			      t=p5.max(0,t/1.25);
			  }
			  return false;
			}


	}
 }]);
	 
