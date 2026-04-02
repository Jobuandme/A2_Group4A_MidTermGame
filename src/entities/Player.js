class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 22;
    this.h = 16;
    this.vx = 0;
    this.vy = 0;

    // Stats
    this.hp      = C.MAX_HP;
    this.stamina = C.MAX_STAMINA;
    this.invincibleTimer = 0;

    // State flags
    this.onCeiling        = false;  // touching ceiling (natural rest state)
    this.onFloor          = false;  // touching top of a platform from below
    this.onWall           = 0;      // -1 left, 0 none, 1 right
    this.isHanging        = false;  // gripping ceiling or wall
    this.isOnPlatformTop  = false;  // standing/walking on top of a platform
    this.isDiving         = false;  // actively flying downward
    this.releaseTimer     = 0;      // counts down after releasing from platform top
    this.facingRight      = true;
    this.coyoteTimer      = 0;
    this.dead             = false;
    this.deathTimer       = 0;

    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
    this.wingAngle = 0;
  }

  update(keys, platforms) {
    if (this.dead) { this.deathTimer++; return; }
    this._handleInput(keys);
    this._applyGravity();
    this._move(platforms);
    this._updateStamina();
    this._updateAnimation();
    if (this.invincibleTimer > 0) this.invincibleTimer--;
  }

  _handleInput(keys) {
    // W or S while on a platform top = release and start diving
    if (this.isOnPlatformTop && (keys.up || keys.down || keys.space)) {
      this.wantsToRelease = true;
    }

    if (this.isOnPlatformTop && !this.wantsToRelease) {
      // Slow walk on platform top — no diving, gravity overridden in _move
      if (keys.left)       { this.vx = -C.WALK_SPEED; this.facingRight = false; }
      else if (keys.right) { this.vx =  C.WALK_SPEED; this.facingRight = true;  }
      else                   this.vx *= 0.5;
      this.isDiving = false;
      return;
    }

    // Normal horizontal movement in air
    if (keys.left)       { this.vx = -C.MOVE_SPEED; this.facingRight = false; }
    else if (keys.right) { this.vx =  C.MOVE_SPEED; this.facingRight = true;  }
    else                   this.vx *= 0.7;

    // Dive DOWN — hold S / Down / Space
    const wantsToDive = keys.down || keys.space;
    if (wantsToDive && this.stamina > 0) {
      this.vy += C.FLY_FORCE;
      this.isDiving = true;
    } else {
      this.isDiving = false;
    }

    if (this.vy > 6) this.vy = 6;
  }

  _applyGravity() {
    // Skip gravity while calmly standing on platform top
    if (this.isOnPlatformTop && !this.wantsToRelease) return;
    this.vy += C.GRAVITY;  // negative = pulls upward
    if (this.vy < -C.MAX_FALL_SPEED) this.vy = -C.MAX_FALL_SPEED;
  }

  _move(platforms) {
    // Move X in substeps to prevent tunnelling
    const infoX = Physics.moveX(this, platforms, this.vx);
    this.onWall = infoX.left ? -1 : (infoX.right ? 1 : 0);

    // Move Y in substeps to prevent tunnelling
    const infoY = Physics.moveY(this, platforms, this.vy);

    // Inverted gravity:
    // info.top    = bat's top hit something above → ceiling to hang from
    // info.bottom = bat's bottom hit something below → platform top to stand on
    this.onCeiling = infoY.top;
    this.onFloor   = infoY.bottom;

    // Coyote time off ceiling
    if (this.onCeiling) this.coyoteTimer = C.COYOTE_FRAMES;
    else if (this.coyoteTimer > 0) this.coyoteTimer--;

    // Platform top landing
    if (this.onFloor && !this.wantsToRelease) {
      this.isOnPlatformTop = true;
      this.vy = 0;
    } else if (!this.onFloor) {
      this.isOnPlatformTop = false;
    }

    // Only clear release flag once the bat has genuinely left the platform
    // (onFloor was false AND we've moved upward at least a little)
    if (!this.onFloor && this.vy < 0) this.wantsToRelease = false;

    // Ceiling hang
    this.isHanging = (this.onCeiling || this.onWall !== 0) && !this.isDiving;

    // Wall slide
    if (this.onWall !== 0 && !this.onCeiling && this.vy > C.WALL_SLIDE_SPEED) {
      this.vy = C.WALL_SLIDE_SPEED;
    }
  }

  _updateStamina() {
    if (this.isDiving && !this.isHanging && !this.isOnPlatformTop) {
      this.stamina = Math.max(0, this.stamina - C.STAMINA_DRAIN);
    } else if (this.isHanging || this.isOnPlatformTop) {
      this.stamina = Math.min(C.MAX_STAMINA, this.stamina + C.STAMINA_REGEN);
    }
  }

  _updateAnimation() {
    this.animTimer++;
    if (this.isOnPlatformTop) {
      // Walking animation — slow wing shuffle
      if (this.animTimer % 14 === 0) this.animFrame = (this.animFrame + 1) % 2;
      this.wingAngle = Math.sin(this.animTimer * 0.08) * 0.12;
    } else if (this.isDiving) {
      if (this.animTimer % 6 === 0) this.animFrame = (this.animFrame + 1) % 4;
      this.wingAngle = Math.sin(this.animTimer * 0.3) * 0.4;
    } else if (this.isHanging) {
      this.animFrame = 0;
      this.wingAngle = 0;
    } else {
      if (this.animTimer % 12 === 0) this.animFrame = (this.animFrame + 1) % 2;
      this.wingAngle = Math.sin(this.animTimer * 0.1) * 0.15;
    }
  }

  takeDamage() {
    if (this.invincibleTimer > 0 || this.dead) return;
    this.hp--;
    this.invincibleTimer  = C.INVINCIBLE_FRAMES;
    this.isOnPlatformTop  = false;
    this.wantsToRelease   = true;
    // Knock upward — set directly rather than adding so existing velocity
    // doesn't compound. Clamp so we can't exceed max speed.
    this.vy = Math.max(-C.MAX_FALL_SPEED, -4);
    if (this.hp <= 0) { this.dead = true; this.deathTimer = 0; }
  }

  healHp()      { this.hp      = Math.min(C.MAX_HP, this.hp + 1); }
  refillStamina() { this.stamina = C.MAX_STAMINA; }

  respawn(x, y) {
    this.x = x - this.w / 2;
    this.y = y - this.h / 2;
    this.vx = 0; this.vy = 0;
    this.hp      = C.MAX_HP;
    this.stamina = C.MAX_STAMINA;
    this.invincibleTimer  = C.INVINCIBLE_FRAMES;
    this.dead             = false;
    this.deathTimer       = 0;
    this.isOnPlatformTop  = false;
    this.wantsToRelease   = false;
  }

  get cx() { return this.x + this.w / 2; }
  get cy() { return this.y + this.h / 2; }

  draw(p) {
    if (this.dead) { this._drawDeath(p); return; }
    const blink = this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 5) % 2 === 0;
    if (blink) return;  // no push yet — safe to return early
    p.push();
    p.translate(this.cx, this.cy);
    if (!this.facingRight) p.scale(-1, 1);
    this._drawBat(p);
    p.pop();
  }

  _drawBat(p) {
    const t = Date.now() * 0.001;

    if (this.isOnPlatformTop) {
      // Right-side up — standing on platform top
      // No vertical flip; bat stands upright on the platform
    } else {
      // Upside-down — natural hanging orientation
      p.scale(1, -1);
    }

    const wingFlap = this.isDiving
      ? Math.sin(t * 12)
      : (this.isHanging || this.isOnPlatformTop ? 0 : Math.sin(t * 3) * 0.3);

    // Recharge glow
    if ((this.isHanging || this.isOnPlatformTop) && this.stamina < C.MAX_STAMINA) {
      p.noStroke();
      p.fill(`rgba(232,82,30,${0.1 + 0.1 * Math.sin(t * 4)})`);
      p.ellipse(0, 0, 40, 20);
    }

    // Wings
    p.noStroke();
    p.fill(this._bodyColor());
    const lWingY = -4 + wingFlap * 6;
    p.beginShape();
    p.vertex(0, -2); p.vertex(-8, lWingY); p.vertex(-16, lWingY - 2);
    p.vertex(-12, lWingY + 6); p.vertex(-4, lWingY + 8); p.vertex(0, 2);
    p.endShape(p.CLOSE);

    const rWingY = -4 - wingFlap * 6;
    p.beginShape();
    p.vertex(0, -2); p.vertex(8, rWingY); p.vertex(16, rWingY - 2);
    p.vertex(12, rWingY + 6); p.vertex(4, rWingY + 8); p.vertex(0, 2);
    p.endShape(p.CLOSE);

    // Body
    p.fill(this._bodyColor());
    p.ellipse(0, 2, 14, 12);
    p.fill('rgba(180,80,60,0.4)');
    p.ellipse(0, 4, 8, 7);

    // Head
    p.fill(this._bodyColor());
    p.circle(0, -5, 12);

    // Ears
    p.fill(this._bodyColor());
    p.triangle(-3, -8, -6, -14, -1, -10);
    p.triangle( 3, -8,  6, -14,  1, -10);
    p.fill('rgba(210,100,80,0.6)');
    p.triangle(-3, -8, -5, -13, -2, -10);
    p.triangle( 3, -8,  5, -13,  2, -10);

    // Eyes
    p.fill('#ffffff');
    p.circle(-3, -5, 4); p.circle(3, -5, 4);
    p.fill('#120504');
    p.circle(-2.5, -5, 2.5); p.circle(3.5, -5, 2.5);
    p.fill('rgba(255,255,255,0.8)');
    p.circle(-2, -6, 1); p.circle(4, -6, 1);

    // Nose
    p.fill('rgba(200,80,60,0.8)');
    p.ellipse(0, -2, 4, 2);

    // Low stamina aura
    if (this.stamina < C.STAMINA_LOW) {
      const pulse = 0.3 + 0.3 * Math.sin(t * 8);
      p.noFill();
      p.stroke(`rgba(239,68,68,${pulse})`);
      p.strokeWeight(1.5);
      p.ellipse(0, 0, 30, 22);
    }
  }

  _bodyColor() {
    if (this.invincibleTimer > 0) return 'rgba(255,140,100,0.9)';
    if (this.stamina < C.STAMINA_LOW) return '#4a1208';
    return '#2a0a06';
  }

  _drawDeath(p) {
    const progress = this.deathTimer / 60;
    const alpha = Math.max(0, 1 - progress);
    p.push();
    p.translate(this.cx, this.cy);
    p.rotate(progress * Math.PI * 3);
    p.scale(1 - progress * 0.5);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + progress;
      const dist  = progress * 30;
      p.fill(`rgba(220,80,40,${alpha})`);
      p.noStroke();
      p.circle(Math.cos(angle) * dist, Math.sin(angle) * dist, 6);
    }
    p.fill(`rgba(80,20,10,${alpha})`);
    p.ellipse(0, 0, 20 * (1 - progress), 16 * (1 - progress));
    p.pop();
  }
}
