class Level {
  constructor(data) {
    this.data = data;
    this.platforms = [];
    this.spikes = [];
    this.fruits = [];
    this.exit = null;
    this.playerStart = { x: 100, y: 100 };
    this.fruitsCollected = 0;
    this.complete = false;

    // World pixel dimensions
    this.worldW = data.cols * C.TILE;
    this.worldH = data.rows * C.TILE;

    this._buildFromMap(data.map);
    this._mergeHorizontalPlatforms();
  }

  _buildFromMap(map) {
    const T = C.TILE;
    const rawPlatforms = [];

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const tile = map[row][col];
        const x = col * T;
        const y = row * T;

        if (tile === 1) {
          rawPlatforms.push({ col, row, x, y });
        } else if (tile === 2) {
          this.spikes.push(new Spike(x, y, 'up'));
        } else if (tile === 3) {
          this.spikes.push(new Spike(x, y, 'down'));
        } else if (tile === 4) {
          this.fruits.push(new Fruit(x + T / 2, y + T / 2));
        } else if (tile === 5) {
          this.playerStart = { x: x + T / 2, y: y + T / 2 };
        } else if (tile === 6) {
          this.exit = { x, y, w: T, h: T };
        }
      }
    }

    // Convert raw platform positions to Platform objects (1 tile each before merging)
    for (const p of rawPlatforms) {
      this.platforms.push(new Platform(p.x, p.y, T, T));
    }
  }

  // Merge adjacent horizontal tiles into longer platforms for better collision perf
  _mergeHorizontalPlatforms() {
    const T = C.TILE;
    // Sort by row then col
    this.platforms.sort((a, b) => a.y - b.y || a.x - b.x);
    const merged = [];
    let current = null;

    for (const p of this.platforms) {
      if (current && current.y === p.y && current.x + current.w === p.x) {
        current.w += T;
      } else {
        if (current) merged.push(current);
        current = new Platform(p.x, p.y, T, T);
      }
    }
    if (current) merged.push(current);
    this.platforms = merged;
  }

  collectFruit(fruit) {
    fruit.collected = true;
    this.fruitsCollected++;
  }

  get fruitsRemaining() {
    return this.data.fruitsNeeded - this.fruitsCollected;
  }

  get exitUnlocked() {
    return this.fruitsCollected >= this.data.fruitsNeeded;
  }

  draw(p, echoSystem) {
    // Background
    p.background(C.BG);

    // Draw platforms
    for (const plat of this.platforms) {
      plat.draw(p);
    }

    // Draw spikes
    for (const spike of this.spikes) {
      spike.draw(p, echoSystem ? spike.echoAlpha : 0);
    }

    // Draw fruits
    for (const fruit of this.fruits) {
      if (!fruit.collected) fruit.draw(p);
    }

    // Draw exit
    if (this.exit) {
      this._drawExit(p);
    }
  }

  _drawExit(p) {
    const ex = this.exit;
    if (this.exitUnlocked) {
      // Glowing portal
      p.noStroke();
      for (let i = 5; i > 0; i--) {
        p.fill(`rgba(124,58,237,${0.04 * i})`);
        p.rect(ex.x - i * 3, ex.y - i * 3, ex.w + i * 6, ex.h + i * 6, 6);
      }
      p.fill('rgba(167,139,250,0.3)');
      p.rect(ex.x, ex.y, ex.w, ex.h, 4);
      p.stroke('#a78bfa');
      p.strokeWeight(2);
      p.noFill();
      p.rect(ex.x, ex.y, ex.w, ex.h, 4);

      // Animated arrow
      const bounce = Math.sin(Date.now() * 0.005) * 3;
      p.fill('#e2d9f3');
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(18);
      p.text('▶', ex.x + ex.w / 2, ex.y + ex.h / 2 + bounce);
    } else {
      // Locked — dim outline
      p.stroke('rgba(92,72,120,0.5)');
      p.strokeWeight(1);
      p.noFill();
      p.rect(ex.x, ex.y, ex.w, ex.h, 4);
    }
  }

  checkExitCollision(player) {
    if (!this.exit || !this.exitUnlocked) return false;
    const ex = this.exit;
    return player.x + player.w > ex.x &&
           player.x < ex.x + ex.w &&
           player.y + player.h > ex.y &&
           player.y < ex.y + ex.h;
  }
}
