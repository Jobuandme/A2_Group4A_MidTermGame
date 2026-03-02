class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.echoAlpha = 0; // 0–1, driven by Echolocation system
  }

  // Draw solid fill + subtle edge — visible only inside vision circle (fog handles clipping)
  draw(p) {
    p.noStroke();
    p.fill(C.PLATFORM_COLOR);
    p.rect(this.x, this.y, this.w, this.h);

    p.stroke(C.PLATFORM_EDGE);
    p.strokeWeight(1);
    p.noFill();
    p.rect(this.x, this.y, this.w, this.h);
  }

  // Draw glowing outline only — called AFTER the fog mask so it shows through darkness
  drawEchoOutline(p) {
    if (this.echoAlpha <= 0) return;

    const a = this.echoAlpha;

    // Outer glow (wide, soft)
    p.noFill();
    p.stroke(`rgba(192,132,252,${a * 0.25})`);
    p.strokeWeight(8);
    p.rect(this.x, this.y, this.w, this.h);

    // Mid glow
    p.stroke(`rgba(210,160,255,${a * 0.5})`);
    p.strokeWeight(3);
    p.rect(this.x, this.y, this.w, this.h);

    // Sharp inner edge
    p.stroke(`rgba(230,200,255,${a * 0.9})`);
    p.strokeWeight(1);
    p.rect(this.x, this.y, this.w, this.h);
  }

  // Returns true if rect (ox,oy,ow,oh) overlaps this platform
  overlaps(ox, oy, ow, oh) {
    return ox < this.x + this.w &&
           ox + ow > this.x &&
           oy < this.y + this.h &&
           oy + oh > this.y;
  }
}
