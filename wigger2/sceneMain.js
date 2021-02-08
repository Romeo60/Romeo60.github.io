class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }

    preload()
    {
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
    create() {
    this.bg = this.add.image(0,0, 'bg');
        //floor
    this.floor = this.add.image(0, 0, 'ground');
    this.floor1 = this.add.image(0, 0, 'ground');
    this.floor2 = this.add.image(0, 0, 'ground');
    this.floor3= this.add.image(0, 0, 'ground');
    this.floor4 = this.add.image(0, 0, 'ground');
    this.floor5 = this.add.image(0, 0, 'ground');
            //player
    this.player = this.physics.add.sprite(0, 0, 'dude');
    this.this.player.setBounce(0.2);
    //this.player.scaleX= 1;
    //this.player.scaleY= 2;
    this.player.setCollideWorldBounds(true);

    this.ball = this.physics.add.image(0,0, 'ball');
    this.ball.setBounce(0.3);
    //this.ball.scaleX = .25;
    //this.ball.scaleY = .25;


        this.aGrid = new AlignGrid({scene:this,rows:11, cols:11});
        this.aGrid.showNumbers();

        this.aGrid.placeAtIndex(60, this.bg);
        this.aGrid.placeAtIndex(110, this.floor);
        this.aGrid.placeAtIndex(112, this.floor2);
        this.aGrid.placeAtIndex(114, this.floor3);
        this.aGrid.placeAtIndex(116, this.floor4);
        this.aGrid.placeAtIndex(118, this.floor1);
        this.aGrid.placeAtIndex(120, this.floor5);
        //player & ball
        this.aGrid.placeAtIndex(55, this.player);
        this.aGrid.placeAtIndex(58, this.ball);
        
        //this.aGrid.placeAtIndex(120, this.floor);
    }
    update() {}
}