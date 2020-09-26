var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstacle, obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score;
var gameOverImg, restartImg;
var jumpSound , dieSound;

var backgroundImg;
var sun, sunImage;

function preload(){
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.wav");
  dieSound = loadSound("collided.wav");
  
  sunImage = loadImage("sun.png");
  backgroundImg = loadImage("backgroundImg.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

 
  trex = createSprite(50, height-70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.08;
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  invisibleGround = createSprite(width/2,height - 10, width, 125);
  invisibleGround.visible = false;
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunImage);
  sun.scale = 0.1;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  
  trex.setCollider("rectangle", 0, 0,trex.width,trex.height);
  //trex.debug = true
  
  score = 0;
  
  
  
  
}

function draw() {
  
  background(backgroundImg);


  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
  
    score = score + Math.round(getFrameRate()/60);
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    
    if((touches.length > 0 || keyDown("space")) && trex.y >= height - 120){
        trex.velocityY = -12;
        jumpSound.play();
      touches = [];
    }
    
    
    trex.velocityY = trex.velocityY + 0.8;
  
    
    spawnClouds();
  

    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){

        
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     

      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0;
  
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
    if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
 
  trex.collide(invisibleGround);
  



  drawSprites();
  
    textSize(30);
  fill("black");
  text("Score: "+ score, windowWidth/2 - 400, 50);
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score = 0;
}


function spawnObstacles(){
  
 if (frameCount % 100 === 0){
   obstacle = createSprite(width + 10, height - 95, 20, 30);
   obstacle.velocityX = -(6 + score/100);
   //obstacle.debug = true;
   obstacle.setCollider("circle", 0, 0, 45);
   
    
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
    }
             
    obstacle.scale = 0.3;
    obstacle.lifetime = 3000;
   

   
   //obstacle.collide(invisibleGround);
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  
  if (frameCount % 120 === 0) {
    var cloud = createSprite(width+20, height-300,40,10);
    cloud.y = Math.round(random(80, height - 800));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 3000;
    

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
   
    cloudsGroup.add(cloud);
  }
}

