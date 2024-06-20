import Phaser from 'phaser';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';

function Game() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'game',
      width: "800",
      height: "600",
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 800 }
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    let player;
    let cursors;
    let space;

    function preload() {
      this.load.spritesheet('blob_walk', 'assets/Green_Slime/Walk.png', { frameWidth: 128, frameHeight: 128 });
      this.load.spritesheet('blob_run', 'assets/Green_Slime/Run.png', { frameWidth: 128, frameHeight: 128 });
      this.load.spritesheet('blob_jump', 'assets/Green_Slime/Jump.png', { frameWidth: 128, frameHeight: 128 });
      this.load.spritesheet('blob_idle', 'assets/Green_Slime/Idle.png', { frameWidth: 128, frameHeight: 128 });
      this.load.image('ground', 'assets/ground.png');
    }

    function create() {
      let ground = this.add.tileSprite(0, this.sys.game.config.height - 16, parseInt(this.sys.game.config.width) * 2, 32, 'ground');
      this.physics.add.existing(ground, true);

      player = this.physics.add.sprite(400, 300, 'blob_idle');
      player.setCollideWorldBounds(true);

      // Set the ground as a collider for the player
      this.physics.add.collider(player, ground);

      cursors = this.input.keyboard.createCursorKeys();
      space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      // Create animations
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('blob_walk', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('blob_run', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('blob_jump', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNumbers('blob_jump', { frames: [7, 6, 5, 4, 3, 2, 1, 0] }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('blob_idle', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
      });
    }

    function update() {
      let speed = 160;
      let running = false;
      
      if (space.isDown) {
        speed = 800;
        running = true;
      }
      
      if (player.body.velocity.y < 0) {
        player.anims.play('jump', true);
      }
      else if (player.body.velocity.y > 0) {
        player.anims.play('fall', true);
      }
      else if (cursors.left.isDown) {
        if (running) {
          player.anims.play('run', true);
        }
        else {
          player.anims.play('walk', true);
        }
        player.setVelocityX(-speed);
        player.setFlipX(true);
      }
      else if (cursors.right.isDown) {
        if (running) {
          player.anims.play('run', true);
        }
        else {
          player.anims.play('walk', true);
        }
        player.setVelocityX(speed);
        player.setFlipX(false);
      }
      else {
        player.anims.play('idle', true);
        player.setVelocityX(0);
      }

      // If the jump key is down and the player is touching the ground, start the jump
      if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.touching.down) {
        player.setVelocityY(-100);
        player.jumpStart = this.time.now; // Record the time when the jump started
        player.anims.play('jump', true);
      }

      // If the jump key is down, the player is in the air, and less than 500 ms have passed since the jump started, continue the jump
      if (cursors.up.isDown && !player.body.touching.down && this.time.now - player.jumpStart < 500) {
        player.setVelocityY(-200);
      }
    }

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <Box
      id="game"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}
    />
  );
};

export default Game;