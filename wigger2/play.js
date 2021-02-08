var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    }
};

var player;
var ball;
var floor;
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
var game = new Phaser.Game(config);

function preload(){

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

    this.add.image(400, 300, 'bg');
    //add the ground made of 8 block
    floor = this.physics.add.staticGroup();
    
    floor.create(0,600, 'ground');
    floor.create(100,600, 'ground');
    floor.create(200,600, 'ground');
    floor.create(300,600, 'ground');
    floor.create(400,600, 'ground');
    floor.create(500,600, 'ground');
    floor.create(600,600, 'ground');
    floor.create(700,600, 'ground');
    floor.create(800,600, 'ground');
    // add sign
    sign = this.physics.add.image(50, 500, 'sign');
    sign.setCollideWorldBounds(true);
    //add crates

    down = this.physics.add.sprite(700,500, 'down');
    down.setCollideWorldBounds(true);
    down.body.allowGravity = false;
    up = this.physics.add.sprite(700,300, 'up');
    up.setCollideWorldBounds(true);
    up.body.allowGravity = false;

    //level One
    levOne = this.physics.add.image(600, 300, '14');
    levOne.scaleX = .25;

    //Bullet Level
    levThree = this.physics.add.image(580, 600, 'Bullet');
    levThree.scaleX =.25;
    levThree.disableBody();
    levThree.setVisible(false);

    //create a player
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.scaleX= 1;
    player.scaleY= 2;
    player.setCollideWorldBounds(true);

    //add a ball
    /*ball = this.physics.add.group();
    ball.create(200, 450, 'ball');
    ball.setBounce(0.4);  
    */
    ball = this.physics.add.image(200, 450, 'ball');
    ball.setBounce(0.3);
    ball.scaleX = .25;
    ball.scaleY = .25;
    

  

    //adding scoreText

    scoreText = this.add.text(16, 16, '', {fontSize: '32px', fill: "#1234"});
    over = this.add.text(280, 300, '', {fontSize: '55px', fill: "#0234"});
    //Game over buttons
    
    
     //leve two
    levTwo = this.physics.add.image(300, 0, "15");
    levTwo.disableBody();
    levTwo.scaleX = .25;
    //put our player & ball on top of the ground, set collision between ball and player
    
    this.physics.add.collider(player, floor);
    this.physics.add.collider(ball, floor);
    this.physics.add.collider(sign, floor);
    this.physics.add.collider(ball, player, kickBall);
    this.physics.add.collider(up, ball, hitBox);
    this.physics.add.collider(down, ball, hitBox);
    this.physics.add.collider(down, player, runBack);
    this.physics.add.collider(down, floor);
    this.physics.add.collider(sign, player, stopRunning);
    // Game play Collisions
    this.physics.add.collider(levOne, floor, levelOne);
    this.physics.add.collider(ball, levOne, gameOver);
    this.physics.add.collider(ball, levTwo, gameOver);
    this.physics.add.collider(ball, levThree, gameOver);


    //  Our player animations, turning, walking left and walking right.
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
    
    

    //events
    //cursors = this.input.keyboard.createCursorKeys();
    var zone1 = this.add.zone(655, 0, 369, 360).setOrigin(0).setName(-400).setInteractive();
    var zone2 = this.add.zone(680, 450, 344, 600).setOrigin(0).setName(-150).setInteractive();

    //event contol
    player.anims.play('turn');


}
function update(){
this.input.on('gameobjectdown', function (pointer, gameObject) {
        
        player.setVelocityX(340);
        player.anims.play('right', true);
        
       
       // ball.x = pointer.x; 
        //ball.y = pointer.y;

        kick = (gameObject.name);
        //label.x = gameObject.x;
        //label.y = gameObject.y;

    });
//Operation Rebirth
if(levTwo.y>config.height){
        levTwo.enableBody(true,600,0, true, true);
        levTwo.setVelocityY(300);
    }
if(levThree.y < 0){
        levThree.enableBody(true,580, 600, true, true);
        levThree.setVelocityY(-800);
    }
    if(levThree.y > config.height){
        levThree.enableBody(true,580, 600, true, true);
        levThree.setVelocityY(-800);
    }
//Difficulty Section
    if(score==0){
        levOne.disableBody();
        levOne.setVisible(false);
        levTwo.disableBody();
        levTwo.setVisible(false);
        levThree.disableBody();
        levThree.setVisible(false);
    }
    if(score<12){
        levOne.disableBody();
        levOne.setVisible(false);
    }
    //Enter Drip
    if(score==12){
        levTwo.enableBody();
        levTwo.setVisible(true);
        levTwo.setVelocityY(110);
        if(levTwo.y > config.height){
        reset15;
    }

    }
    if(score == 20){
        levTwo.setVelocityY(300);
    }
    if(score == 28){
        levTwo.setVelocityY(450);
    }
    if(score == 32){
        levTwo.disableBody();
        levTwo.setVisible(false);

    }
    //Enter Bounce
    if(score == 36){
        levOne.enableBody();
        levOne.setVisible(true);

    }
    if(score==56){
        levOne.disableBody();
        levOne.setVisible(false);
    }//exit Bounce

    //Enter Rocket
    if(score== 60){
        levThree.setVisible(true);
        levThree.enableBody();
        levThree.setVelocityY(-800);
    }//Enter Bobby
    if(score==100){
        levTwo.setVisible(true);
        levTwo.enableBody();
    }

    if(score==156){
        levTwo.disableBody();
        levTwo.setVisible(false);
        levThree.setVelocityY(-8*score);
    }

    
/*sMovenent with keyboard
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
    //add ball collide action
    
*/
    
}
function kickBall(ball, player){
    
    ball.setVelocityX(670);
    ball.setVelocityY(kick);
    player.setVelocityX(330);
     
    
}
function hitBox(down, ball){
    
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
function onPlay(){
    levOne.setVisible(false);
    levOne.disableBody();
}

function levelOne(){
    
    levOne.setVelocityY(levOneSpeed);
}
// level two functions



function reset15(){
    levOne.y =0;
}
function gameOver(  ){
    player.disableBody();
    ball.disableBody(true);
    ball.setVisible(false);
    option();
    //over.setText("Game Over!"); 
}

function option(){
    var submit = window.confirm("Game Over! Submit score?");
    if(submit == true){
        submitScore();
    }
    else{
        score = score*0;
    scoreText.setText('Score: ' + score);
        player.enableBody(true, 100, 0, true, true);
        player.anims.play('turn');
        ball.enableBody(true, 150, 0, true, true);
        ball.setVelocityY(-200);
        ball.setBounce(0.3);
        levOne.disableBody();
        levOne.setVisible(false);
        levTwo.disableBody();
        levTwo.setVisible(false);
        levThree.disableBody();
        levThree.setVisible(false);
        score==0;
        scoreText.setText("Score: "+score);

    }
}

function submitScore(){
    document.getElementById('hiddenfield').value  = score;
    document.getElementById('playerForm').submit();
}