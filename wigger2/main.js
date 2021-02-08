var game;
window.onload = function() {
    var isMobile = navigator.userAgent.indexOf("Mobile");
    if (isMobile == -1) {
        isMobile = navigator.userAgent.indexOf("Tablet");
    }
    var w = 640;
    var h =480 ;
    if (isMobile != -1) {
        w = window.innerWidth;
        h = window.innerHeight;
    }
    var config = {
        type: Phaser.AUTO,
        width: w,
        height: h,
        parent: 'phaser-game',
        physics: {
        default: 'arcade',
        arcade: {
            gravity: {y:300},
            debug: false
        }
    },
        scene: [SceneMain]
    };
    game = new Phaser.Game(config);
}
var bg;
 var player;
var ball;
var floor;
var floor1;
var floor2;
var floor3;
var floor4;
var floor5;
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