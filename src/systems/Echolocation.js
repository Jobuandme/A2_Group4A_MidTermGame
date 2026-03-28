class Echolocation {
  constructor() {
    this.cooldownTimer = 0;
    this.echoTimer = 0;       // counts down from ECHO_DURATION
    this.pulseRadius = 0;
    this.pulseActive = false;
    this.pulseX = 0;
    this.pulseY = 0;
    this.active = false;      // true while echo is visible
  }

  trigger(playerCX, playerCY) {
    if (this.cooldownTimer > 0) return false;

    this.cooldownTimer = C.ECHO_COOLDOWN;
    this.echoTimer = C.ECHO_DURATION;
    this.pulseRadius = 0;
    this.pulseActive = true;
    this.pulseX = playerCX;
    this.pulseY = playerCY;
    this.active = true;
    return true;
  }

  update() {
    if (this.cooldownTimer > 0) this.cooldownTimer--;

    if (this.echoTimer > 0) {
      this.echoTimer--;
      this.active = true;
    } else {
      this.active = false;
    }

    if (this.pulseActive) {
      this.pulseRadius += C.ECHO_RADIUS_GROWTH;
      // Stop pulse when it covers a large area
      if (this.pulseRadius > Math.max(C.WIDTH, C.HEIGHT) * 1.5) {
        this.pulseActive = false;
      }
    }
  }

  // Returns 0–1 alpha for echo objects based on timer
  get echoAlpha() {
    if (this.echoTimer <= 0) return 0;
    if (this.echoTimer > C.ECHO_FADE_START) return 1;
    return this.echoTimer / C.ECHO_FADE_START;
  }

  // Returns 0–1 for cooldown progress (1 = ready)
  get cooldownProgress() {
    if (this.cooldownTimer <= 0) return 1;
    return 1 - (this.cooldownTimer / C.ECHO_COOLDOWN);
  }

  get isReady() {
    return this.cooldownTimer <= 0;
  }

  // Apply echo alpha to all platforms and spikes in level
  applyToLevel(level) {
    const alpha = this.echoAlpha;
    for (const p of level.platforms) p.echoAlpha = alpha;
    for (const s of level.spikes)    s.echoAlpha = alpha;
    for (const f of level.fruits)    if (!f.collected) f.echoAlpha = alpha;
  }

  // Draw the expanding ring pulse (in world space, called before visibility mask)
  drawPulse(p) {
    if (!this.pulseActive) return;

    const alpha = Math.max(0, 1 - this.pulseRadius / 600);
    p.noFill();
    p.stroke(`rgba(255,90,40,${alpha * 0.7})`);
    p.strokeWeight(3);
    p.circle(this.pulseX, this.pulseY, this.pulseRadius * 2);

    p.stroke(`rgba(255,140,80,${alpha * 0.3})`);
    p.strokeWeight(8);
    p.circle(this.pulseX, this.pulseY, this.pulseRadius * 2 - 10);
  }
}
