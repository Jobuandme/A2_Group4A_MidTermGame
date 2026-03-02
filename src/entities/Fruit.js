class Fruit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.collected = false;
    this.echoAlpha = 0;
    this.colorIndex = Math.floor(Math.random() * C.FRUIT_COLORS.length);
    this.color = C.FRUIT_COLORS[this.colorIndex];
    this.bobOffset = Math.random() * Math.PI * 2;
    this.radius = 9;
    // Particles for collection
    this.particles = [];
    this.collectTimer = 0;
  }

  draw(p) {
    const bob = Math.sin(Date.now() * 0.003 + this.bobOffset) * 3;
    const cy = this.y + bob;

    p.push();

    // Echo glow
    if (this.echoAlpha > 0) {
      for (let i = 3; i > 0; i--) {
        p.noStroke();
        p.fill(`rgba(${this._hexToRgb(this.color)},${this.echoAlpha * 0.15 * i})`);
        p.circle(this.x, cy, (this.radius + i * 4) * 2);
      }
    }

    // Fruit body
    p.noStroke();
    p.fill(this.color);
    p.circle(this.x, cy, this.radius * 2);

    // Shine
    p.fill('rgba(255,255,255,0.45)');
    p.circle(this.x - this.radius * 0.3, cy - this.radius * 0.3, this.radius * 0.7);

    // Stem
    p.stroke(this._darken(this.color));
    p.strokeWeight(1.5);
    p.line(this.x, cy - this.radius, this.x + 3, cy - this.radius - 5);

    p.pop();
  }

  _hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  _darken(hex) {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 60);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 60);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 60);
    return `rgb(${r},${g},${b})`;
  }

  collidesWith(player) {
    const dx = (player.x + player.w / 2) - this.x;
    const dy = (player.y + player.h / 2) - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.radius + 12;
  }
}
