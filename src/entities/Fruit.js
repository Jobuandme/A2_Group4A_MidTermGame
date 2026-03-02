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
  }

  // Draw full fruit — only visible inside vision circle
  draw(p) {
    const bob = Math.sin(Date.now() * 0.003 + this.bobOffset) * 3;
    const cy = this.y + bob;

    p.push();
    p.noStroke();
    p.fill(this.color);
    p.circle(this.x, cy, this.radius * 2);

    p.fill('rgba(255,255,255,0.45)');
    p.circle(this.x - this.radius * 0.3, cy - this.radius * 0.3, this.radius * 0.7);

    p.stroke(this._darken(this.color));
    p.strokeWeight(1.5);
    p.line(this.x, cy - this.radius, this.x + 3, cy - this.radius - 5);
    p.pop();
  }

  // Draw glowing dot outline — called AFTER fog so it glows through the dark
  drawEchoOutline(p) {
    if (this.echoAlpha <= 0) return;

    const bob = Math.sin(Date.now() * 0.003 + this.bobOffset) * 3;
    const cy = this.y + bob;
    const a = this.echoAlpha;
    const rgb = this._hexToRgb(this.color);

    p.push();
    p.noStroke();

    // Outer bloom
    p.fill(`rgba(${rgb},${a * 0.12})`);
    p.circle(this.x, cy, (this.radius + 10) * 2);

    // Mid glow ring
    p.fill(`rgba(${rgb},${a * 0.25})`);
    p.circle(this.x, cy, (this.radius + 4) * 2);

    // Sharp outline circle
    p.noFill();
    p.stroke(`rgba(${rgb},${a * 0.9})`);
    p.strokeWeight(1.5);
    p.circle(this.x, cy, this.radius * 2);

    // Bright dot at center
    p.noStroke();
    p.fill(`rgba(255,255,255,${a * 0.6})`);
    p.circle(this.x, cy, 3);

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
