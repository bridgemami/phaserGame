/* Students: Please use this week's project for Week 13: Assignment 11: Basic Game. 
     You will need to replace the contents of this JavaScript file with your own work, 
     and create any other files, if any, required for the assignment.
     When you are done, be certain to submit the assignment in both Repl.it and Canvas to be graded. */
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
        },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 300},
        debug: false
      }
    }
};
var player;
var stars;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var game = new Phaser.Game(config);
//inserting the png
function preload ()
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png')
  this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
  console.log("1. images done");
}
console.log("2. preload done");

//creating the stage
function create ()
{//background
  this.add.image(400, 300, 'sky');
  //this.add.image(0, 0, 'sky').setOrigin(0, 0);
  //the star image
  //this.add.image(400, 300, 'star');
  console.log("3. add image done");
  //physics
  platforms = this.physics.add.staticGroup();
 //ground, double in size
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
   //more bars
   platforms.create(600, 400, 'ground');
   platforms.create(50, 250, 'ground');
   platforms.create(750, 220, 'ground');
   console.log("4. platforms done");
//add the avatar & sprite
player = this.physics.add.sprite(100, 450, 'dude');
//movement
player.setBounce(0.2);
player.setCollideWorldBounds(true);
this.anims.create ({
  key: 'left',
  frames : this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
  frameRate: 10,
  repeat: -1
});
this.anims.create({
  key: 'turn',
  frames: [{key: 'dude', frame: 4}],
  frameRate: 20
});
this.anims.create({
  key: 'right',
  frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
  frameRate: 10,
  repeat: -1
});
console.log("5. ani done");
cursors= this.input.keyboard.createCursorKeys();
//sprite on ground
console.log("7. keyboard");
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70}
  });
  console.log("8. add stars");
  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  console.log("9. add bounce & next bombs");
  });
  //bombs
  bombs= this.physics.add.group();
  //add score
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});
  //collide stars, player and bombs
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);
  //players overplas of the stars
  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.collider(player, bombs, hitBomb, null,this);
  }
//}
console.log("6. create done");
function update ()
{ if(gameOver) {
  return;
}
  
  //cursors = this.input.keyboard.createCursorKeys();
  //add movement
if (cursors.left.isDown){
  player.setVelocityX(-160);
  player.anims.play('left', true);
}
else if (cursors.right.isDown) {
  player.setVelocityX(160);
  player.anims.play('right', true);}
  else {
    player.setVelocityX(0);
    player.anims.play('turn');}
  if (cursors.up.isDown && player.body.touching.down){
      player.setVelocityY(-330);
      console.log("7. keyboard");
  }
}
function collectStar(player, star) {
    star.disableBody(true, true);
    //add scoreText & score
    score += 5;
    scoreText.setText('Score:' + score);
    if(stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      var bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }
  function hitBomb (player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  }

  
  
 
  
  
  