class Spike {
  constructor(x, y, direction = 'up') {
    this.x = x;
    this.y = y;
    this.direction = direction; // 'up' or 'down'
    this.echoAlpha = 0;
    this.w = C.TILE;
    this.h = C.TILE;
  }

  draw(p) {
    const T = C.TILE;
    const numSpikes = 3;
    const spikeW = T / numSpikes;

    p.push();
    p.noStroke();

    for (let i = 0; i < numSpikes; i++) {
      const sx = this.x + i * spikeW + spikeW / 2;

      // Echo glow
      if (this.echoAlpha > 0) {
        p.fill(`rgba(255,80,80,${this.echoAlpha * 0.3})`);
        if (this.direction === 'up') {
          p.triangle(
            sx - spikeW * 0.8, this.y + T,
            sx + spikeW * 0.8, this.y + T,
            sx, this.y - 6
          );
        } else {
          p.triangle(
            sx - spikeW * 0.8, this.y,
            sx + spikeW * 0.8, this.y,
            sx, this.y + T + 6
          );
        }
      }

      // Spike body
      p.fill(C.SPIKE_COLOR);
      if (this.direction === 'up') {
        p.triangle(
          sx - spikeW * 0.5, this.y + T,
          sx + spikeW * 0.5, this.y + T,
          sx, this.y + 4
        );
      } else {
        p.triangle(
          sx - spikeW * 0.5, this.y,
          sx + spikeW * 0.5, this.y,
          sx, this.y + T - 4
        );
      }

      // Highlight edge
      if (this.echoAlpha > 0) {
        p.stroke(`rgba(255,150,150,${this.echoAlpha})`);
        p.strokeWeight(1);
        if (this.direction === 'up') {
          p.line(sx - spikeW * 0.5, this.y + T, sx, this.y + 4);
          p.line(sx, this.y + 4, sx + spikeW * 0.5, this.y + T);
        } else {
          p.line(sx - spikeW * 0.5, this.y, sx, this.y + T - 4);
          p.line(sx, this.y + T - 4, sx + spikeW * 0.5, this.y);
        }
        p.noStroke();
      }
    }

    p.pop();
  }

  getHitbox() {
    const T = C.TILE;
    const shrink = 6;
    if (this.direction === 'up') {
      return { x: this.x + shrink, y: this.y + T / 2, w: T - shrink * 2, h: T / 2 };
    } else {
      return { x: this.x + shrink, y: this.y, w: T - shrink * 2, h: T / 2 };
    }
  }

  collidesWith(player) {
    const hb = this.getHitbox();
    return player.x < hb.x + hb.w &&
           player.x + player.w > hb.x &&
           player.y < hb.y + hb.h &&
           player.y + player.h > hb.y;
  }
}
