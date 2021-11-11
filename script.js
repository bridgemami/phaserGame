/* Students: Please use this week's project for Week 13: Assignment 11: Basic Game. 
     You will need to replace the contents of this JavaScript file with your own work, 
     and create any other files, if any, required for the assignment.
     When you are done, be certain to submit the assignment in both Repl.it and Canvas to be graded. */
//step 1. define the name's characteristics in an object value saved in a variable to use later
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // tell phaser engine how to find the blocks of code (functions) I am providing for the game
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
// step 2. define global variables that al functions can access to work with game objects
var player;
var stars;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var game = new Phaser.Game(config);
// step 3. PRELOAD the phaser library runs our function for preload to load all the images and audio for the game
function preload ()
{// load a couple of image file assets to use during create
    // image() takes 2 args: string nickname for the asset, filepath to file
  this.load.image('sky', 'assets/cloud.png');
  this.load.image('tree', 'assets/tree.png');
  this.load.image('grass', 'assets/grass.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/1_sm.png');
  this.load.image('bomb', 'assets/bomb.png');
  // spritesheet() takes 3 args: string nickname for the asset, filepath to file, frame dimension
  //this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
  this.load.spritesheet('dude', 'assets/officer.png', {frameWidth: 64, frameHeight: 64});
  console.log("1. images done");
}
console.log("2. preload done");

// step 4. CREATE the phaser library next runs our function for creating/laying out the game, bkgnd, create game objects, etc.
function create ()
{// display a game object in the visible game stage
    // 3 args: x-coord, y-coord, asset nickname string
  this.add.image(400, 300, 'sky').setScale(2.7);
  this.add.image(400, 300, 'grass');
  this.add.image(400, 300, 'tree').setScale(2.7);
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
// add another game object, this time a player-controlled object often called a sprite
    // to work with game objects in multiple stage of a scene, save a ref to obj in a global var
    // sprite() takes 3 args: x-coord, y-coord, asset nickname string
player = this.physics.add.sprite(100, 450, 'dude');
//movement
player.setBounce(0.2);
// ask the physics sim in the engine to prevent a game object from falling off screen
player.setCollideWorldBounds(true);
this.anims.create ({
  key: 'left',
  frames : this.anims.generateFrameNumbers('dude', {start: 9, end: 16}), 
  frameRate: 10,
  repeat: -1
});
this.anims.create({
  key: 'turn',
  frames: [{key: 'dude', frame: 18}],
  frameRate: 20
});
this.anims.create({
  key: 'right',
  frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 7}), 
  frameRate: 10,
  repeat: -1
});
console.log("5. ani done");
cursors= this.input.keyboard.createCursorKeys();
//sprite on ground
console.log("7. keyboard");
  stars = this.physics.add.group({
    key: 'star',
    repeat: 9,
    setXY: { x: 15, y: 0, stepX: 75}
  });
  console.log("8. add stars");
  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0, 1));
  console.log("9. add bounce & next bombs");
  });
  //bombs
  bombs= this.physics.add.group();
  //add score
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'});
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
{ //look at the global var that Phaser is saving the state of arrows inside
 // check left and right arrow keys
  if(gameOver) {
  return;
}
  
  //cursors = this.input.keyboard.createCursorKeys();
  //check left and right arrow keys
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
  /*if(cursors.up.isDown){
   player.setVelocityY(-160);}
else if (cursors.down.isDown){player.setVelocityY(160);}
 else {
  // could change vertical velocity but gravity would be messed up
 }*/
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

  
  
 
  
  
  