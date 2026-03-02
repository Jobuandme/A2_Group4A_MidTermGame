class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.echoAlpha = 0; // 0–1, driven by Echolocation system
  }

  draw(p) {
    // Body fill — only visible near player (handled by visibility mask)
    p.noStroke();
    p.fill(C.PLATFORM_COLOR);
    p.rect(this.x, this.y, this.w, this.h);

    // Base edge always faintly visible when close (handled by clipping)
    p.stroke(C.PLATFORM_EDGE);
    p.strokeWeight(1);
    p.noFill();
    p.rect(this.x, this.y, this.w, this.h);

    // Echolocation highlight
    if (this.echoAlpha > 0) {
      p.noFill();
      p.stroke(`rgba(192,132,252,${this.echoAlpha})`);
      p.strokeWeight(2);
      p.rect(this.x, this.y, this.w, this.h);

      // Subtle inner glow
      p.stroke(`rgba(220,180,255,${this.echoAlpha * 0.3})`);
      p.strokeWeight(6);
      p.rect(this.x + 1, this.y + 1, this.w - 2, this.h - 2);
    }
  }

  // Returns true if rect (ox,oy,ow,oh) overlaps this platform
  overlaps(ox, oy, ow, oh) {
    return ox < this.x + this.w &&
           ox + ow > this.x &&
           oy < this.y + this.h &&
           oy + oh > this.y;
  }
}
