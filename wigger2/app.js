//Game config
var config = {
    type: Phaser.AUTO,
    width: 700,
    height: 350,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y:300},
            debug: false
        }
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebWebAudio: true
    }
};
var game = new Phaser.Game(config);

//game variables
var player;
var ball;
var floor;
var flare;
var up;
var scoreText;
var down;
var sign;
var kick;
var score = 0;
var levOne;
var levTwo;
var levThree;
var levFour;
var levFive;
var levOneSpeed = -370;
var over;
var music;
var hit;
var flare;

function resize() {
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;

        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
        console.log("Resized!!");
    } 

function preload(){
    //load music
    this.load.audio('music', 'assets/abi.mp3');
    this.load.audio('flare', 'assets/fly.mp3');
    this.load.audio('box', 'assets/Bounce.mp3');
   /* ------------------------------------------------------*/
    this.load.image('bg', 'assets/BG.png');
    this.load.image('down', 'assets/down.png');
    this.load.image('up', 'assets/up.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('sign', 'assets/Sign_1.png');
    this.load.image('14', 'assets/14.png');
    this.load.image('15', 'assets/15.png');
    this.load.image('Bullet', 'assets/Bullet.png');
    this.load.image('try', 'assets/try.png');
    this.load.image('submit', 'assets/submit.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
      
}
function create(){
    window.addEventListener('resize', resize);
        resize();
        //add Music
        //add music
    music = this.sound.add('music');
    var musicConfig={
        mute: false,
        volume: 0.7,
        rate: 1,
        detune: 0,
        seek:0,
        loop: true,
        delay:0
    }
    music.play(musicConfig);

    //add sound
    hit = this.sound.add('box');
    flare = this.sound.add('flare');

        //Creating the game
        this.bg = this.add.image(350,150, 'bg'); 
        floor = this.physics.add.staticGroup();      
        floor.create(0,350, 'ground');
        floor.create(124,350, 'ground');
        floor.create(200,350, 'ground');
        floor.create(300,350, 'ground');
        floor.create(400,350, 'ground');
        floor.create(500,350, 'ground');
        floor.create(600,350, 'ground');
        floor.create(700,350, 'ground');
         // add sign
    sign = this.physics.add.image(0, 0, 'sign');
    sign.setCollideWorldBounds(true);
    //add crates

    down = this.physics.add.staticImage(600,250, 'down');
    down.setCollideWorldBounds(true);
    down.body.allowGravity = false;
    up = this.physics.add.staticImage(600,100, 'up');
    up.setCollideWorldBounds(true);
    up.body.allowGravity = false;
    //Add the player sprite
    player = this.physics.add.sprite(100, 200, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.scaleX= 1;
    player.scaleY= 2;
    player.setCollideWorldBounds(true);
    //Add Ball
     ball = this.physics.add.image(140, 50, 'ball');
    ball.setBounce(0.3);
    ball.scaleX = .25;
    ball.scaleY = .25;

    //Collisions
    this.physics.add.collider(player, floor);
    this.physics.add.collider(sign, floor);
    this.physics.add.collider(ball, floor);
    this.physics.add.collider(ball, player, kickBall);
    this.physics.add.collider(up, ball, hitBox);
    this.physics.add.collider(down, ball, hitBox);
    this.physics.add.collider(down, player, runBack);
    this.physics.add.collider(sign, player, stopRunning);
    

    //Level sprites-----------------------------------------------
    //level One
    levOne = this.physics.add.image(300, 200, '14');
    levOne.scaleX = .25;
     //leve two
    levTwo = this.physics.add.image(500, 0, "15");
    levTwo.disableBody();
    levTwo.scaleX = .25;
    //Bullet Level/Three
    levThree = this.physics.add.image(520, 300, 'Bullet');
    levThree.scaleX =.25;
    levThree.disableBody();
    levThree.setVisible(false);
    /*-----------------------------------------------------------*/

    // Game play Collisions
    this.physics.add.collider(levOne, floor, bounce);
    this.physics.add.collider(ball, levTwo, gameOver);
    this.physics.add.collider(ball, levThree, gameOver);

    //Animatiuons
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    player.anims.play('turn');//initiate Turn
        
//Score text
scoreText = this.add.text(16, 26, '', {fontSize: '32px', fill: "#000000"});
scoreText.setText('Score: ' + score);

//Touch Zones
var zone1 = this.add.zone(550, 0, 370, 165).setOrigin(0).setName(-400).setInteractive();
var zone2 = this.add.zone(550, 210, 400, 300).setOrigin(0).setName(-150).setInteractive();

   }
   function update(){
    this.input.on('gameobjectdown', function (pointer, gameObject) {        
        player.setVelocityX(340);
        player.anims.play('right', true);
        kick = (gameObject.name);
        });
    //-------------------------------------GAME DIFFICULTY IF STATRMENTS---
    //Difficulty Section
    if(score==0){
        levOne.disableBody();
        levOne.setVisible(false);
        levTwo.disableBody();
        levTwo.setVisible(false);
        levThree.disableBody();
        levThree.setVisible(false);
        console.log("Level 1");
    }
    //Enter Drip
    if(score>=4){
        levTwo.enableBody();
        levTwo.setVisible(true);
        levTwo.setVelocityY(110);       

    }
    if(score >= 16){
        levTwo.setVelocityY(160);
    }
    if(score >= 28){
        levTwo.setVelocityY(350);
    }
    if(score >= 36){
        levTwo.setVelocityY(400);
    }
    if(score>=48){//
       
        levTwo.setVelocityY(460);
    }
    //Enter Bounce
    if(score >= 46){
        
        levTwo.setVelocityY(500);        
           }
    if(score>=56){
        levTwo.disableBody();
        levTwo.setVisible(false);
    }//exit Bounce

    //Enter Rocket
    if(score>= 60){
        levThree.setVisible(true);
        levThree.enableBody();
        levThree.setVelocityY(-400);
        flare.play();
    }//Enter Bobby
    if(score>=100){
        /**/
        levThree.setVelocityY(-500);
    }

    if(score>=130){
        levTwo.setVisible(true);
        levTwo.enableBody(true,450,0, true, true);
        levTwo.setVelocityY(250);
        levThree.setVelocityY(-300);
    }

    if(score>=160){
        levTwo.setVisible(false);
        levTwo.enableBody(false);
        
        levThree.setVelocityY(-300-score);
    }
    ////Operation Game object Rebirth
if(levTwo.y>config.height){
        levTwo.enableBody(true,500,0, true, true);
        levTwo.setVelocityY(300);
    }
if(levThree.y < 0){
        levThree.enableBody(true,520, 350, true, true);
        levThree.setVelocityY(-800);
        flare.play();
    }
    if(levThree.y > config.height){
        levThree.enableBody(true,520, 350, true, true);
        levThree.setVelocityY(-800);
        flare.play();
    }
    if(levOne.y > config.height){
        levOne.setVelecity(240);
    }
    

   }

function kickBall(ball, player){    
    ball.setVelocityX(670);
    ball.setVelocityY(kick);
    player.setVelocityX(330); 
    
}
function hitBox(down, ball){
    hit.play();
    ball.disableBody();
    ball.setVisible(false);
    score = score+4;
    scoreText.setText('Score: ' + score);
    //ball.enableBody(true, 60, 50, true, true);   
   
}
function runBack(down, player){
    player.setVelocityX(-260);
    player.anims.play('left', true);
    ball.enableBody(true, 150, 0, true, true);
    ball.setVelocityY(-200);
    ball.setBounce(0.3);
}
function stopRunning(ball, player, sign){
   
    player.setVelocityX(0);
    player.anims.play('turn', true);
    //ball.setVisible(true);
    score = score + 0;
    scoreText.setText('Score: ' + score);
    
}
//What does it do
function reset15(){
    levTwo.y =0;
}
function onPlay(){
    levOne.setVisible(false);
    levOne.disableBody();
}

function bounce(){
    levOne.setVelocityY(-240);

}

function gameOver(){
    player.anims.play('turn', true);
    player.disableBody();
    ball.disableBody(true);
    ball.setVisible(false);
    music.stop();
    //option();
    //over.setText("Game Over!"); 
}

