// ── State machine ─────────────────────────────────────────────────────────
const STATE = {
  WELCOME:   'welcome',
  TUTORIAL:  'tutorial',
  PLAYING:   'playing',
  DEAD:      'dead',
  LEVEL_WIN: 'level_win',
  GAME_WIN:  'game_win',
};

let state = STATE.WELCOME;

let welcomeScreen, tutorialScreen;
let level, player, camera, echoSystem, visSystem, hud;

const keys = { left: false, right: false, up: false, down: false, space: false };
let currentLevelIndex = 0;
let transitionTimer = 0;
let respawnTimer = 0;

// ── p5 instance mode ──────────────────────────────────────────────────────
const sketch = (p) => {

  p.preload = () => {
    SPRITES.load(p);
  };

  p.setup = () => {
    const canvas = p.createCanvas(C.WIDTH, C.HEIGHT);
    canvas.parent('game-container');
    p.frameRate(60);
    p.textFont('monospace');

    welcomeScreen = new WelcomeScreen();
    tutorialScreen = new TutorialScreen();
    echoSystem = new Echolocation();
    visSystem  = new Visibility();
    hud        = new HUD();
  };

  p.draw = () => {
    switch (state) {
      case STATE.WELCOME:   drawWelcome(p);  break;
      case STATE.TUTORIAL:  drawTutorial(p); break;
      case STATE.PLAYING:   drawPlaying(p);  break;
      case STATE.DEAD:      drawDead(p);     break;
      case STATE.LEVEL_WIN: drawLevelWin(p); break;
      case STATE.GAME_WIN:  drawGameWin(p);  break;
    }
  };

  p.keyPressed = () => {
    const k = p.key;
    const kc = p.keyCode;
    if (kc === p.LEFT_ARROW  || k === 'a' || k === 'A') keys.left  = true;
    if (kc === p.RIGHT_ARROW || k === 'd' || k === 'D') keys.right = true;
    if (kc === p.UP_ARROW    || k === 'w' || k === 'W') keys.up    = true;
    if (kc === p.DOWN_ARROW  || k === 's' || k === 'S') keys.down  = true;
    if (k === ' ') keys.space = true;

    if ((k === 'e' || k === 'E') && state === STATE.PLAYING) {
      echoSystem.pulseX = player.cx;
      echoSystem.pulseY = player.cy;
      echoSystem.trigger(player.cx, player.cy);
    }

    if (kc === p.ENTER || kc === 13) {
      if (state === STATE.WELCOME) {
        state = STATE.TUTORIAL;
      } else if (state === STATE.TUTORIAL) {
        tutorialScreen.nextPage();
        if (tutorialScreen.isDone) {
          loadLevel(0);
          state = STATE.PLAYING;
        }
      } else if (state === STATE.DEAD && respawnTimer > 80) {
        loadLevel(currentLevelIndex);
        state = STATE.PLAYING;
      } else if (state === STATE.LEVEL_WIN && transitionTimer > 100) {
        loadLevel(currentLevelIndex + 1);
        state = STATE.PLAYING;
      } else if (state === STATE.GAME_WIN && transitionTimer > 120) {
        currentLevelIndex = 0;
        tutorialScreen = new TutorialScreen();
        welcomeScreen = new WelcomeScreen();
        state = STATE.WELCOME;
      }
    }
    return false;
  };

  p.keyReleased = () => {
    const k = p.key;
    const kc = p.keyCode;
    if (kc === p.LEFT_ARROW  || k === 'a' || k === 'A') keys.left  = false;
    if (kc === p.RIGHT_ARROW || k === 'd' || k === 'D') keys.right = false;
    if (kc === p.UP_ARROW    || k === 'w' || k === 'W') keys.up    = false;
    if (kc === p.DOWN_ARROW  || k === 's' || k === 'S') keys.down  = false;
    if (k === ' ') keys.space = false;
    return false;
  };
};

new p5(sketch);

// ── Level loader ──────────────────────────────────────────────────────────
function loadLevel(index) {
  currentLevelIndex = index;
  level = new Level(LEVELS[index]);
  player = new Player(level.playerStart.x - 11, level.playerStart.y - 8);
  camera = new Camera();
  camera.snap(player, level.worldW, level.worldH, C.WIDTH, C.HEIGHT);
  echoSystem = new Echolocation();
  hud = new HUD();
  hud.showMessage(level.data.name, 120);
}

// ── State draw functions ──────────────────────────────────────────────────

function drawWelcome(p) {
  welcomeScreen.update();
  welcomeScreen.draw(p);
}

function drawTutorial(p) {
  tutorialScreen.update();
  tutorialScreen.draw(p);
}

function drawPlaying(p) {
  player.update(keys, level.platforms);

  for (const fruit of level.fruits) {
    if (!fruit.collected && fruit.collidesWith(player)) {
      level.collectFruit(fruit);
      if (level.fruitsRemaining === 0) hud.showMessage('Find the exit! ▶', 150);
    }
  }

  for (const spike of level.spikes) {
    if (spike.collidesWith(player)) player.takeDamage();
  }

  if (player.dead && player.deathTimer > 60) {
    state = STATE.DEAD;
    respawnTimer = 0;
  }

  if (level.checkExitCollision(player)) {
    transitionTimer = 0;
    state = currentLevelIndex + 1 < LEVELS.length ? STATE.LEVEL_WIN : STATE.GAME_WIN;
  }

  camera.update(player, level.worldW, level.worldH, C.WIDTH, C.HEIGHT);
  echoSystem.update();
  echoSystem.applyToLevel(level);
  hud.update(level);

  p.background(C.BG);
  p.push();
  camera.apply(p);
  level.draw(p);          // platform/spike/fruit fills (fog will cover most of this)
  p.pop();

  // Fog of war — applied in screen space, covers everything drawn so far
  const ps = camera.worldToScreen(player.cx, player.cy);
  visSystem.apply(p, ps.x, ps.y, C.WIDTH, C.HEIGHT);

  // Echo outlines drawn AFTER fog so they glow through the darkness
  if (echoSystem.active) {
    p.push();
    camera.apply(p);
    level.drawEchoOutlines(p);
    p.pop();
  }

  // Pulse ring and player drawn on top of everything
  p.push();
  camera.apply(p);
  echoSystem.drawPulse(p);
  player.draw(p);
  p.pop();

  hud.draw(p, player, level, echoSystem);
}

function drawDead(p) {
  respawnTimer++;
  p.background(C.BG);
  p.push(); camera.apply(p); level.draw(p); p.pop();

  p.noStroke();
  p.fill('rgba(10,8,18,0.78)');
  p.rect(0, 0, C.WIDTH, C.HEIGHT);
  p.textAlign(p.CENTER, p.CENTER);

  p.textSize(36); p.fill('#ff6030');
  p.text('YOU FELL', C.WIDTH / 2, C.HEIGHT / 2 - 30);

  p.textSize(14); p.fill(C.TEXT_DIM);
  p.text('The bat tumbles into the dark...', C.WIDTH / 2, C.HEIGHT / 2 + 12);

  if (respawnTimer > 80 && Math.floor(respawnTimer / 20) % 2 === 0) {
    p.textSize(14); p.fill('#e8521e');
    p.text('Press ENTER to try again', C.WIDTH / 2, C.HEIGHT / 2 + 52);
  }
}

function drawLevelWin(p) {
  transitionTimer++;
  p.background(C.BG);
  p.push(); camera.apply(p); level.draw(p); player.draw(p); p.pop();

  const alpha = Math.min(0.85, transitionTimer / 60);
  p.noStroke(); p.fill(`rgba(10,8,18,${alpha})`); p.rect(0, 0, C.WIDTH, C.HEIGHT);

  if (transitionTimer > 40) {
    const a = Math.min(1, (transitionTimer - 40) / 30);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(40); p.fill(`rgba(255,90,40,${a})`);
    p.text('LEVEL CLEAR', C.WIDTH / 2, C.HEIGHT / 2 - 30);
    p.textSize(16); p.fill(`rgba(107,203,119,${a})`);
    p.text(`Fruits: ${level.fruitsCollected} / ${level.data.fruitsNeeded}  ✓`, C.WIDTH / 2, C.HEIGHT / 2 + 16);
    if (transitionTimer > 100 && Math.floor(transitionTimer / 20) % 2 === 0) {
      p.textSize(14); p.fill(`rgba(232,82,30,${a})`);
      p.text('Press ENTER for next level →', C.WIDTH / 2, C.HEIGHT / 2 + 60);
    }
  }
}

function drawGameWin(p) {
  transitionTimer++;
  p.background(C.BG);
  for (let i = 0; i < 4; i++) {
    const col = C.FRUIT_COLORS[p.floor(p.random(C.FRUIT_COLORS.length))];
    p.noStroke(); p.fill(col + '99');
    p.circle(p.random(C.WIDTH), p.random(C.HEIGHT), p.random(4, 12));
  }
  const a = Math.min(1, transitionTimer / 60);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(50); p.fill(`rgba(255,90,40,${a})`);
  p.text('YOU ESCAPED!', C.WIDTH / 2, C.HEIGHT / 2 - 50);
  p.textSize(18); p.fill(`rgba(226,217,243,${a})`);
  p.text('The bat soars into the moonlit sky...', C.WIDTH / 2, C.HEIGHT / 2);
  p.textSize(13); p.fill(`rgba(107,203,119,${a})`);
  p.text('All levels complete!', C.WIDTH / 2, C.HEIGHT / 2 + 36);
  if (transitionTimer > 120 && Math.floor(transitionTimer / 25) % 2 === 0) {
    p.textSize(14); p.fill(`rgba(232,82,30,${a})`);
    p.text('Press ENTER to play again', C.WIDTH / 2, C.HEIGHT / 2 + 80);
  }
}
