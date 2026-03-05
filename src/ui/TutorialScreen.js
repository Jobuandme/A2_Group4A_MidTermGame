class TutorialScreen {
  constructor() {
    this.timer = 0;
    this.page = 0;
    this.pages = [
      {
        title: "You Are a Bat",
        icon: '🦇',
        lines: [
          "You live in the dark.",
          "You can only see what's close to you.",
          "The cave stretches far beyond your sight...",
        ]
      },
      {
        title: "Flying & Stamina",
        icon: '⬆',
        lines: [
          "Hold UP / W to fly upward.",
          "Flying drains your STAMINA.",
          "If stamina runs out, you fall!",
          "Hang on any wall, floor, or ceiling to recharge.",
        ]
      },
      {
        title: "Echolocation",
        icon: '◎',
        lines: [
          "Press E to send out a sound pulse.",
          "It reveals the edges of all platforms briefly.",
          "There is a short cooldown between uses.",
          
        ]
      },
      {
        title: "Collect & Escape",
        icon: '🍎',
        lines: [
          "Find and collect all the fruits in each level.",
          "Once collected, the exit portal will unlock.",
          "Watch out for spikes — they deal damage!",
          "You have 3 hearts. Don't lose them all.",
        ]
      },
    ];
  }

  update() {
    this.timer++;
  }

  nextPage() {
    this.page++;
    this.timer = 0;
  }

  get isDone() {
    return this.page >= this.pages.length;
  }

  draw(p) {
    p.background(C.BG);

    // Subtle cave bg
    p.noStroke();
    p.fill('#0d0b14');
    for (let x = 0; x <= p.width; x += 25) {
      const h = 30 + Math.sin(x * 0.05) * 15 + Math.sin(x * 0.12) * 8;
      p.triangle(x - 12, 0, x + 12, 0, x, h);
    }

    // Page indicator dots
    for (let i = 0; i < this.pages.length; i++) {
      const dotX = p.width / 2 - (this.pages.length - 1) * 10 + i * 20;
      p.fill(i === this.page ? '#c084fc' : '#3d2654');
      p.circle(dotX, p.height - 30, i === this.page ? 8 : 5);
    }

    const pg = this.pages[this.page];

    // Icon
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    const iconBob = Math.sin(this.timer * 0.05) * 5;
    p.text(pg.icon, p.width / 2, p.height * 0.25 + iconBob);

    // Title
    p.textSize(28);
    p.fill('#c084fc');
    p.text(pg.title, p.width / 2, p.height * 0.42);

    // Lines
    p.textSize(15);
    p.fill(C.TEXT_MAIN);
    for (let i = 0; i < pg.lines.length; i++) {
      const lineAlpha = Math.min(1, (this.timer - i * 20) / 30);
      if (lineAlpha <= 0) continue;
      p.fill(`rgba(226,217,243,${lineAlpha})`);
      p.text(pg.lines[i], p.width / 2, p.height * 0.55 + i * 28);
    }

    // Next / start
    const allVisible = this.timer > pg.lines.length * 20 + 30;
    if (allVisible && Math.floor(this.timer / 25) % 2 === 0) {
      p.textSize(13);
      p.fill('#a78bfa');
      const isLast = this.page === this.pages.length - 1;
      p.text(isLast ? 'Press ENTER to start!' : 'Press ENTER for next →', p.width / 2, p.height * 0.88);
    }
  }
}
