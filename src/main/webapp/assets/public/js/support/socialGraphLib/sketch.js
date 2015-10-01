var nodi={};
var archi=[];
var ranks={}; //stato dei nodi al tempo corrente;

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

function createNodeState() {
  var ns={};
  ns.links=0;
  ns.posts=0;
  ns.getRadius = function() {
    return (pow(ns.posts,1.5)+10)*0.75;
  }
  return ns;
}
function createNode(id, name) {
  var node= {
    id:id, 
    name:name, 
    x: [random(0,width) ,0,0,0,0], 
    y: [random(0,height),0,0,0,0],
    targets: [],
    vx: 0.0,
    vy: 0.0,
    ax: 0.0,
    ay: 0.0,
    phase: random(0,TWO_PI)
  };
  node.setX= function(x) {
    var xs=shorten(node.x);
    node.x=splice(xs,x,0);    
  }
  node.setY= function(y) {
    var ys=shorten(node.y);
    node.y=splice(ys,y,0);
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
      var sat=255-128/pow(sq(node.vx)+sq(node.vy)+1,0.3);
      push();
        colorMode(RGB);
        var alpha=map(i, node.x.length,0,0,1);
        alpha=pow(alpha,3)*255;
        stroke(255,alpha);
        colorMode(HSB);
        fill(140,sat,sat,alpha);
        var r1=map(i,0,node.x.length,r,0);
        ellipse(node.x[i],node.y[i],r1,r1);
      pop();
    }
  }
  node.flash = function() {
    push();
      var ns=ranks[node.id];
      var r=ns.getRadius()*2;
      fill(255,255,128,128);
      noStroke();
      ellipse(node.getX(),node.getY(),flashingRadius*r,flashingRadius*r);
    pop();
  }
  return node;
}

//esponenziazione con segno preso dalla base
function p(b,e) {
  if (b>0) return pow(b,e);
  else if (b<0) return -pow(-b,e);
  else return 0;
}

function setup() {
  createCanvas(w,h);
  for (var i in events) {
    var e=events[i];
    var autore=e.author;
    autore.x=random(0,width);
    autore.y=random(0,height);
    var id=autore.id;
    if (nodi[id]!=={}) {
      nodi[id]=createNode(id,autore.name);
      ranks[id]=createNodeState();
    }
    switch (e.action) {
      case "post":
        archi.push({from:id, to:id})
        break;
      case "tag":
      case "comment":
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

function draw() {
  flashingRadius*=0.95;
  if (draggingBar) {
    barra=map(mouseX,20,width-20,0,archi.length-1);
    barra=floor(constrain(barra,0,archi.length-1));
    flashingRadius=3;
  } else if (dragged!==null) {
    dragged.setX(mouseX);    
    dragged.setY(mouseY);
  }
  
  background(128);
  stroke(255);
  
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
    dx0=nodo.getX()-width/2;
    dy0=nodo.getY()-height/2;
    var d0=sqrt(sq(dx0)+sq(dy0));
    if (d0<1) d0=1;
    var mass=1;
    ns=ranks[nodo.getId()];
    if (ns) mass+=ns.posts;
    nodo.ax= -g*mass*dx0/d0;
    nodo.ay= -g*mass*dy0/d0;
    //calcolo la forza di repulsione reciproca tra tutte le particelle
    for (var j in nodi) {
      if (i==j) continue;
      var m=nodi[j];
      dx=nodo.getX()-m.getX();
      dy=nodo.getY()-m.getY();
      var d=pow(sq(dx)+sq(dy),1.5);
      if (d<10) {
        //se i due nodi quasi coincidono, genero una forza intensa in una direzione casuale
        var a=random(0,TWO_PI);
        dx=cos(a);
        dy=sin(a);
        d+=0.01;
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
  for (i=0; i<=barra; i++) {
    var arco=archi[i];
    var n1=nodi[arco.from];
    var m1=nodi[arco.to];
    ns=ranks[arco.from];
    if (arco.from!==arco.to) {
      ns.links++;
      flashing=null;
    } else {
      flashing=n1;
      ns.posts++;
    }
    ranks[arco.from]=ns;
    var ms=ranks[arco.to];
    if (arco.from!==arco.to) ms.links++;
    ranks[arco.to]=ms;
    dx=n1.getX()-m1.getX();
    dy=n1.getY()-m1.getY();
    //disegno l'arco da n1 a m1 come curva di bezier di tipo quadratico
    push();
      noFill();
      strokeWeight((ns.links+ms.links)*0.5);
      var xa=(n1.getLastX()+m1.getLastX())*0.5;
      var ya=(n1.getLastY()+m1.getLastY())*0.5;
      bezier(n1.getX(),n1.getY(), xa,ya, xa,ya, m1.getX(),m1.getY());
    pop();
    //applico la forza elastica di attrazione lungo l'arco
    n1.ax+= -k*dx;
    n1.ay+= -k*dy;
    m1.ax+=  k*dx;
    m1.ay+=  k*dy;
  }
  f=frameCount*sqrt(t)/TWO_PI;
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
    n2.vx+=t*sin(f+n2.phase);
    n2.vy+=t*cos(f+n2.phase);
    
    //aggiorno la posizione
    n2.setX(n2.getX()+n2.vx*dt);
    n2.setY(n2.getY()+n2.vy*dt);
  
    //forzo le particelle dentro il canvas
    if (n2.getX()<5) {
      n2.setX(5);
      n2.vx*= -1;
    } else if (n2.getX()>width-5) {
      n2.setX(width-5);
      n2.vx*= -1;
    }
    if (n2.getY()<5) {
      n2.setY(5);
      n2.vy*= -1;
    } else if (n2.getY()> height-5) {
      n2.setY(height-5);
      n2.vy*= -1;
    }
  }
  if (inside) {
    push();
      fill(224);
      stroke(128);
      rect(inside.getX()+10, inside.getY()+10,50,25);
      fill(0);
      text(inside.getName(), inside.getX()+15, inside.getY()+28);
    pop();
  }
  //disegno lo slider
  push();
    stroke(255);
    strokeWeight(3);
    line(20,height-20,width-20,height-20);
    stroke(0);
    strokeWeight(1);
    line(20,height-20,width-20,height-20);
    var x4=map(barra,0,archi.length-1,20, width-20);
    var y4=height-20;
    stroke(255);
    fill(192);
    ellipse(x4,y4,20,20);
    noStroke();
    for (i=10; i>0; i--) {
      fill(172+2*i);
      ellipse(x4-2,y4-2,i,i);
    }
  pop();
}


function mousePressed() {
  var x=map(barra,0,archi.length-1,20,width-20);
  var y=height-20;
  var dx=mouseX-x;
  var dy=mouseY-y;
  var d=sq(dx)+sq(dy);
  if (d<400) 
    draggingBar=true;
  

  for (var i in nodi) {
    var nodo=nodi[i];
    dx=mouseX-nodo.getX();
    dy=mouseY-nodo.getY();
    d=sq(dx)+sq(dy);
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

function mouseMoved() {
  inside=null;
  for (var id in nodi) {
    var n=nodi[id];
    var ns=ranks[id];
    if (!ns) ns=createNodeState();
    var r=ns.getRadius();
    var dx=mouseX-n.getX();
    var dy=mouseY-n.getY();
    var d=sq(dx)+sq(dy);
    if (d<r*r) {
      inside=n;
      break;
    }
  }
}

function mouseReleased() {
  dragged=null;
  draggingBar=false;
}

function shuffleNodes() {
  for (var id in nodi) {
    var nodo=nodi[id]
    nodo.setX(random(0,width));
    nodo.setY(random(0,height));
  }
}

function keyTyped() {
  switch (key) {
    case ' ':
    case '+':
      barra=constrain(barra+1,0,archi.length-1);
      flashingRadius=3;
      break;
    case '-':
      barra=constrain(barra-1,0,archi.length-1);
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
      t=min(10,t*1.25);
      break;
    case 'l':
    case 'L':
      t=max(0,t/1.25);
  }
  console.log(ranks);
  return false;
}

