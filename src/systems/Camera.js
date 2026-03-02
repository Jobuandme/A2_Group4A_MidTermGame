class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.lerpSpeed = 0.1;
  }

  update(player, worldW, worldH, viewW, viewH) {
    // Target: center player in view
    this.targetX = player.x + player.w / 2 - viewW / 2;
    this.targetY = player.y + player.h / 2 - viewH / 2;

    // Clamp to world bounds
    this.targetX = Math.max(0, Math.min(this.targetX, worldW - viewW));
    this.targetY = Math.max(0, Math.min(this.targetY, worldH - viewH));

    // Lerp
    this.x += (this.targetX - this.x) * this.lerpSpeed;
    this.y += (this.targetY - this.y) * this.lerpSpeed;
  }

  apply(p) {
    p.translate(-Math.round(this.x), -Math.round(this.y));
  }

  // Convert screen coords to world coords
  screenToWorld(sx, sy) {
    return { x: sx + this.x, y: sy + this.y };
  }

  // Convert world coords to screen coords
  worldToScreen(wx, wy) {
    return { x: wx - this.x, y: wy - this.y };
  }

  // Snap instantly (e.g., on level load)
  snap(player, worldW, worldH, viewW, viewH) {
    this.update(player, worldW, worldH, viewW, viewH);
    this.x = this.targetX;
    this.y = this.targetY;
  }
}
