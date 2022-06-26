var piso,perro;
var pisoImg,perroImg;
var treasureCollection = 0;

//Game States
var gameState=1;

var score=0;
var Hscore =0;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2;
var gameOver,restart;
var invisibleGround;

function preload(){
  pisoImg = loadImage("Road.png");
  perroImg = loadAnimation("1.png","2.png");
  perro_collided = loadAnimation("2.png")
  gameOverImg =loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkPoint = loadSound("checkPoint.mp3")
}

function setup(){
  
  createCanvas(windowWidth,windowHeight);
// Moving background
piso=createSprite( width/2 ,height - 200);
piso.addImage(pisoImg);
piso.velocityX = -4;
piso.scale = 4


//creating perro running
perro = createSprite(width/7,height-250,20,20);
perro.addAnimation("SahilRunning",perroImg);
perro.scale=1  
perro.setCollider("rectangle",  0 , 0 , 220 , 150);

gameOver = createSprite(width/2,height/2-120);
gameOver.addImage(gameOverImg);
//gameOver.debug = true;

restart = createSprite(width/2,height/2);
restart.addImage(restartImg);
//restart.debug = true;

gameOver.scale = 1.5;
restart.scale = 1.5;

gameOver.visible = false;
restart.visible = false;

invisibleGround = createSprite(width/2,height-50,width,10);
invisibleGround.visible = false; 

cloudsGroup = new Group();
obstaclesGroup = new Group();

score = 0;
}

function draw() {
    
  if(gameState === 1){
  background(0);
  
  if(score > Hscore){
    Hscore = score;
  }

  edges= createEdgeSprites();
  perro.collide(edges);

  score = score + Math.round(getFrameRate()/60);
  piso.velocityX = -(6 + 3*score/100);

  if(keyWentDown("space") && perro.y >= height - 420) {
    perro.velocityY = -18;
    jump.play();
  }

  perro.velocityY = perro.velocityY + 0.8
  
  //code to reset the background
  if( piso.x < width/3 ){
  piso.x = width/2;
  }

  if(obstaclesGroup.isTouching(perro)){
    gameState = 0;
    die.play();
  } 

  if(frameCount %200 === 0 ){
    checkPoint.play();
  }

  perro.collide(invisibleGround);
  obstaclesGroup.collide(invisibleGround)
  spawnObstacles1();
  spawnClouds();
  
  textSize(20);
  fill(255);
  text("Score: "+ score ,150,30);
  text("HighScore: "+ Hscore ,350,30);

  }else if (gameState === 0) {
      
    gameOver.visible = true;
    restart.visible = true;
    
    //establece velocidad de cada objeto del juego en 0
    piso.velocityX = 0;
    perro.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //cambia la animación de perro
    perro.changeAnimation("collided",perro_collided);
    
    //establece ciclo de vida a los objetos del juego para que nunca puedan ser destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      gameState = 1;
      gameOver.visible = false;
      restart.visible = false;
  
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
  
      perro.changeAnimation("SahilRunning",perroImg);
      score = 0;

      textSize(20);
      fill(255);
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 80 === 0) {
    var cloud = createSprite(width+200,height-200,40,10);
    cloud.y = Math.round(random(height-200,height-400));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -(6 + 3*score/100);
    
     //asigna ciclo de vida a la variable
    cloud.lifetime = width/cloud.velocityX;
    
    //ajusta la profundiad
    cloud.depth = perro.depth;
    perro.depth = perro.depth + 1;
    restart.depth = restart.depth +1;
    
    //agrega cada nube al grupo  
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles1() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(width+200,height-90,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //genera obstáculos al azar
    var rand = Math.round(random(1,1));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      default: break;
    }
    
    //asigna escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.7;
    obstacle.lifetime = width/obstacle.velocityX;
    obstacle.setCollider("rectangle",  0 , 0 , 180, 100);
    //agrega cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }
}