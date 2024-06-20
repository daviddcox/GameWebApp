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
      this.load.image('blob', 'path_to_your_blob_image.png');
      this.load.image('ground', 'assets/ground.png');
    }

    function create() {
      let ground = this.add.tileSprite(0, this.sys.game.config.height - 16, parseInt(this.sys.game.config.width) * 2, 32, 'ground');
      this.physics.add.existing(ground, true);

      player = this.physics.add.sprite(400, 300, 'blob');
      player.setCollideWorldBounds(true);

      // Set the ground as a collider for the player
      this.physics.add.collider(player, ground);

      cursors = this.input.keyboard.createCursorKeys();
      space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    function update() {
      let speed = 160;
      if (space.isDown) {
        speed = 800;
      }
      if (cursors.left.isDown) {
        player.setVelocityX(-speed);
      }
      else if (cursors.right.isDown) {
        player.setVelocityX(speed);
      }
      else {
        player.setVelocityX(0);
      }

      // If the jump key is down and the player is touching the ground, start the jump
      if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.touching.down) {
        player.setVelocityY(-200);
        player.jumpStart = this.time.now; // Record the time when the jump started
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