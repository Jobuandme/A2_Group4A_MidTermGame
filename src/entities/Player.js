class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 22;
    this.h = 16;
    this.vx = 0;
    this.vy = 0;

    // Stats
    this.hp = C.MAX_HP;
    this.stamina = C.MAX_STAMINA;
    this.invincibleTimer = 0;

    // State flags
    this.onGround = false;
    this.onCeiling = false;
    this.onWall = false;    // -1 left, 0 none, 1 right
    this.isHanging = false; // touching any surface while not flying
    this.isFlying = false;
    this.facingRight = true;
    this.coyoteTimer = 0;
    this.dead = false;
    this.deathTimer = 0;

    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
    this.wingSpread = 0;    // 0–1, used for sprite sizing
    this.wingAngle = 0;
  }

  update(keys, platforms) {
    if (this.dead) {
      this.deathTimer++;
      return;
    }

    this._handleInput(keys);
    this._applyGravity();
    this._move(platforms);
    this._updateStamina();
    this._updateAnimation();

    if (this.invincibleTimer > 0) this.invincibleTimer--;
  }

  _handleInput(keys) {
    // Horizontal movement
    if (keys.left)  { this.vx = -C.MOVE_SPEED; this.facingRight = false; }
    else if (keys.right) { this.vx = C.MOVE_SPEED; this.facingRight = true; }
    else this.vx *= 0.7;

    // Flying (hold UP or Space)
    const wantsToFly = keys.up || keys.space;
    if (wantsToFly && this.stamina > 0) {
      this.vy += C.FLY_FORCE;
      this.isFlying = true;
    } else {
      this.isFlying = false;
    }

    // Cap upward flight speed
    if (this.vy < -6) this.vy = -6;
  }

  _applyGravity() {
    this.vy += C.GRAVITY;
    if (this.vy > C.MAX_FALL_SPEED) this.vy = C.MAX_FALL_SPEED;
  }

  _move(platforms) {
    // Move X
    this.x += this.vx;
    let info = Physics.resolve(this, platforms);
    this.onWall = info.left ? -1 : (info.right ? 1 : 0);

    // Move Y
    this.y += this.vy;
    info = Physics.resolve(this, platforms);
    this.onGround  = info.bottom;
    this.onCeiling = info.top;

    // Coyote time
    if (this.onGround) this.coyoteTimer = C.COYOTE_FRAMES;
    else if (this.coyoteTimer > 0) this.coyoteTimer--;

    // Determine hanging state (resting on any surface without active flying)
    this.isHanging = (this.onGround || this.onCeiling || this.onWall !== 0) && !this.isFlying;

    // Wall slide
    if (this.onWall !== 0 && !this.onGround && this.vy > C.WALL_SLIDE_SPEED) {
      this.vy = C.WALL_SLIDE_SPEED;
    }
  }

  _updateStamina() {
    if (this.isFlying && !this.isHanging) {
      this.stamina = Math.max(0, this.stamina - C.STAMINA_DRAIN);
    } else if (this.isHanging) {
      this.stamina = Math.min(C.MAX_STAMINA, this.stamina + C.STAMINA_REGEN);
    }
  }

  _updateAnimation() {
    this.animTimer++;
    if (this.isFlying) {
      if (this.animTimer % 6 === 0) this.animFrame = (this.animFrame + 1) % 4;
      this.wingAngle = Math.sin(this.animTimer * 0.3) * 0.4;
    } else if (this.isHanging) {
      this.animFrame = 0;
      this.wingAngle = 0;
    } else {
      if (this.animTimer % 12 === 0) this.animFrame = (this.animFrame + 1) % 2;
      this.wingAngle = Math.sin(this.animTimer * 0.1) * 0.1;
    }
  }

  takeDamage() {
    if (this.invincibleTimer > 0 || this.dead) return;
    this.hp--;
    this.invincibleTimer = C.INVINCIBLE_FRAMES;
    this.vy = -4;
    if (this.hp <= 0) {
      this.dead = true;
      this.deathTimer = 0;
    }
  }

  respawn(x, y) {
    this.x = x - this.w / 2;
    this.y = y - this.h / 2;
    this.vx = 0;
    this.vy = 0;
    this.hp = C.MAX_HP;
    this.stamina = C.MAX_STAMINA;
    this.invincibleTimer = C.INVINCIBLE_FRAMES;
    this.dead = false;
    this.deathTimer = 0;
  }

  // Center X and Y
  get cx() { return this.x + this.w / 2; }
  get cy() { return this.y + this.h / 2; }

  draw(p) {
    if (this.dead) {
      this._drawDeath(p);
      return;
    }

    const blink = this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 5) % 2 === 0;
    if (blink) return;

    p.push();
    p.translate(this.cx, this.cy);
    if (!this.facingRight) p.scale(-1, 1);

    this._drawBat(p);

    p.pop();
  }

  _drawBat(p) {
    const t = Date.now() * 0.001;
    const wingFlap = this.isFlying ? Math.sin(t * 12) : (this.isHanging ? 0 : Math.sin(t * 3) * 0.3);

    // Hanging bat flips upside down on ceiling
    const hangOnCeiling = this.onCeiling && !this.isFlying;
    if (hangOnCeiling) p.scale(1, -1);

    // Wing glow if hanging (recharging)
    if (this.isHanging && this.stamina < C.MAX_STAMINA) {
      p.noStroke();
      p.fill(`rgba(167,139,250,${0.1 + 0.1 * Math.sin(t * 4)})`);
      p.ellipse(0, 0, 40, 20);
    }

    // Left wing
    p.noStroke();
    p.fill(this._bodyColor());
    const lWingY = -4 + wingFlap * 6;
    p.beginShape();
    p.vertex(0, -2);
    p.vertex(-8, lWingY);
    p.vertex(-16, lWingY - 2);
    p.vertex(-12, lWingY + 6);
    p.vertex(-4, lWingY + 8);
    p.vertex(0, 2);
    p.endShape(p.CLOSE);

    // Right wing
    const rWingY = -4 - wingFlap * 6;
    p.beginShape();
    p.vertex(0, -2);
    p.vertex(8, rWingY);
    p.vertex(16, rWingY - 2);
    p.vertex(12, rWingY + 6);
    p.vertex(4, rWingY + 8);
    p.vertex(0, 2);
    p.endShape(p.CLOSE);

    // Body
    p.fill(this._bodyColor());
    p.ellipse(0, 2, 14, 12);

    // Belly
    p.fill('rgba(180,150,210,0.4)');
    p.ellipse(0, 4, 8, 7);

    // Head
    p.fill(this._bodyColor());
    p.circle(0, -5, 12);

    // Ears
    p.fill(this._bodyColor());
    p.triangle(-3, -8, -6, -14, -1, -10);
    p.triangle(3, -8, 6, -14, 1, -10);

    // Inner ears
    p.fill('rgba(220,140,200,0.6)');
    p.triangle(-3, -8, -5, -13, -2, -10);
    p.triangle(3, -8, 5, -13, 2, -10);

    // Eyes
    p.fill('#ffffff');
    p.circle(-3, -5, 4);
    p.circle(3, -5, 4);
    p.fill('#1a1025');
    p.circle(-2.5, -5, 2.5);
    p.circle(3.5, -5, 2.5);

    // Eye shine
    p.fill('rgba(255,255,255,0.8)');
    p.circle(-2, -6, 1);
    p.circle(4, -6, 1);

    // Nose
    p.fill('rgba(200,120,180,0.8)');
    p.ellipse(0, -2, 4, 2);

    // Stamina aura when low
    if (this.stamina < C.STAMINA_LOW) {
      const pulse = 0.3 + 0.3 * Math.sin(t * 8);
      p.noFill();
      p.stroke(`rgba(239,68,68,${pulse})`);
      p.strokeWeight(1.5);
      p.ellipse(0, 0, 30, 22);
    }
  }

  _bodyColor() {
    const inv = this.invincibleTimer > 0;
    if (inv) return `rgba(200,150,255,0.9)`;
    if (this.stamina < C.STAMINA_LOW) return '#5a3a6a';
    return '#3d2654';
  }

  _drawDeath(p) {
    // Spinning and fading
    const progress = this.deathTimer / 60;
    const alpha = Math.max(0, 1 - progress);
    p.push();
    p.translate(this.cx, this.cy);
    p.rotate(progress * Math.PI * 3);
    p.scale(1 - progress * 0.5);
    p.globalAlpha = alpha;

    // Explosion particles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + progress;
      const dist = progress * 30;
      p.fill(`rgba(180,100,255,${alpha})`);
      p.noStroke();
      p.circle(Math.cos(angle) * dist, Math.sin(angle) * dist, 6);
    }

    p.fill(`rgba(80,40,120,${alpha})`);
    p.ellipse(0, 0, 20 * (1 - progress), 16 * (1 - progress));
    p.pop();
  }
}
